import { zValidator } from "@hono/zod-validator";
import { getPoemBySlugRequestSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { MAX_EXCERPT_LENGTH } from "../constants";
import { poemsMaterialized } from "../schemas/db";
import type { AppContext, Poem, PoemData } from "../types";
import { extractPoemExcerpt, processPoemContent } from "../utils/poem";

const app = new Hono<AppContext>()
  .get("/random", async (c) => {
    const db = c.get("db");
    const result = await db.execute(sql`SELECT get_a_random_poem()`);

    if (
      !result ||
      !result.rows ||
      result.rows.length === 0 ||
      !result.rows[0]
    ) {
      throw new HTTPException(500, { message: "No poem data returned" });
    }

    const poemJson = result.rows[0].get_a_random_poem;
    const poem: Poem =
      typeof poemJson === "string" ? JSON.parse(poemJson) : poemJson;

    if (!poem || typeof poem !== "object" || !poem.content) {
      throw new HTTPException(500, { message: "Invalid poem data format" });
    }

    const content = extractPoemExcerpt(poem);

    if (content.length > MAX_EXCERPT_LENGTH) {
      throw new HTTPException(500, {
        message: `Excerpt exceeds maximum length: ${content.length}/${MAX_EXCERPT_LENGTH}`,
      });
    }

    c.header("Content-Type", "text/plain; charset=utf-8");
    c.header("Cache-Control", "no-store");
    return c.text(content);
  })
  .get(
    "/slug/:slug",
    zValidator("param", getPoemBySlugRequestSchema),
    async (c) => {
      const { slug } = c.req.valid("param");
      const db = c.get("db");

      const result = await db
        .select()
        .from(poemsMaterialized)
        .where(eq(poemsMaterialized.slug, slug));

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
    console.error("Error POEMS Route:", error);

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
