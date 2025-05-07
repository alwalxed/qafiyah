import { zValidator } from "@hono/zod-validator";
import {
  getPoemBySlugRequestSchema,
  getRandomPoemRequestSchema,
} from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  FALLBACK_RANDOM_POEM_LINES,
  FALLBACK_RANDOM_POEM_SLUG,
  MAX_EXCERPT_LENGTH,
} from "../constants";
import { poemsFullData } from "../schemas/db";
import type { AppContext, Poem, PoemData } from "../types";
import { extractPoemExcerpt } from "../utils/extract-poem-excerpt";
import { processPoemContent } from "../utils/process-poem-content";

const app = new Hono<AppContext>();
app
  .get(
    "/random",
    zValidator("query", getRandomPoemRequestSchema),
    async (c) => {
      const { option } = c.req.valid("query");
      const db = c.get("db");

      try {
        c.header("Cache-Control", "no-store");

        if (option === "lines") {
          const result = await db.execute(
            sql`SELECT get_random_eligible_poem()`
          );

          if (
            !result?.rows?.length ||
            !result.rows[0]?.get_random_eligible_poem
          ) {
            throw new Error("No poem found");
          }

          const poemJson = result.rows[0].get_random_eligible_poem;
          const poem: Poem =
            typeof poemJson === "string" ? JSON.parse(poemJson) : poemJson;

          if (!poem?.content) {
            throw new Error("Invalid poem format");
          }

          const content = extractPoemExcerpt(poem);

          if (content.length > MAX_EXCERPT_LENGTH) {
            throw new Error("Poem excerpt too long");
          }

          c.header("Content-Type", "text/plain; charset=utf-8");
          return c.text(content);
        } else {
          const result = await db.execute(
            sql`SELECT get_random_eligible_poem_slug()`
          );

          if (
            !result?.rows?.length ||
            !result.rows[0]?.get_random_eligible_poem_slug
          ) {
            throw new Error("No poem slug found");
          }

          return c.json(result.rows[0].get_random_eligible_poem_slug);
        }
      } catch (error) {
        console.error("Error fetching random poem:", error);

        if (option === "lines") {
          c.header("Content-Type", "text/plain; charset=utf-8");
          return c.text(FALLBACK_RANDOM_POEM_LINES);
        } else {
          return c.json({ slug: FALLBACK_RANDOM_POEM_SLUG });
        }
      }
    }
  )
  .get(
    "/slug/:slug",
    zValidator("param", getPoemBySlugRequestSchema),
    async (c) => {
      const { slug } = c.req.valid("param");
      const db = c.get("db");

      const result = await db
        .select()
        .from(poemsFullData)
        .where(eq(poemsFullData.slug, slug));

      if (!result || result.length === 0) {
        throw new HTTPException(404, { message: "Poem not found" });
      }

      const data = result[0] as PoemData;

      if (
        !data.title ||
        !data.content ||
        !data.poet_name ||
        !data.poet_slug ||
        !data.meter_name ||
        !data.theme_name ||
        !data.era_name ||
        !data.era_slug
      ) {
        console.error(`Incomplete poem data for slug: ${slug}`);
        throw new HTTPException(500, { message: "Incomplete poem data" });
      }

      const clearTitle = data.title.replace(/"/g, "");
      const processedContent = processPoemContent(data.content);

      const responseData = {
        data: {
          poet_name: data.poet_name,
          poet_slug: data.poet_slug,
          era_name: data.era_name,
          era_slug: data.era_slug,
          meter_name: data.meter_name,
          theme_name: data.theme_name,
          type_name: data.type_name || undefined,
        },
        clearTitle,
        processedContent,
      };

      return c.json(createValidatedResponse("poemDetail", responseData));
    }
  )
  //! ERR HANDLING ------------------------------------------>
  .onError((error, c) => {
    console.error(error);

    if (error instanceof HTTPException) {
      return c.json(
        {
          success: false,
          error: error.message,
          status: error.status,
        },
        error.status
      );
    }

    return c.json(
      {
        success: false,
        error: "Internal Server Error. POEMS Route",
        status: 500,
      },
      500
    );
  });

export default app;
