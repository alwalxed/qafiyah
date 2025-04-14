import { zValidator } from "@hono/zod-validator";
import { getPoemBySlugRequestSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { Hono } from "hono";
import type { AppContext, PoemData } from "../types";
import { poemsMaterialized } from '../schemas/db';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { processPoemContent } from '../utils/poem';

const app = new Hono<AppContext>().get(
  "/poems/:slug",
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
);

export default app;
