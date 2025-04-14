import { zValidator } from "@hono/zod-validator";
import { searchRequestSchema, searchResponseSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { ilike, or, sql } from "drizzle-orm";
import { Hono } from "hono";
import { poemsSearchMaterialized } from "../schemas/db";
import type { AppContext } from "../types";

const MAX_RESULTS_PER_PAGE = 10;

const app = new Hono<AppContext>().get(
  "/",
  zValidator("query", searchRequestSchema),
  async (c) => {
    try {
      // Log the schema definition
      console.log("Search response schema:", searchResponseSchema);

      const { q, page } = c.req.valid("query");
      const db = c.get("db");

      const limit = MAX_RESULTS_PER_PAGE;
      const offset = (page - 1) * limit;

      const sanitizedQuery = q.replace(/[%_\\]/g, "\\$&");

      const searchCondition = or(
        sql`${poemsSearchMaterialized.content_tsv} @@ plainto_tsquery('arabic', ${sanitizedQuery})`,
        ilike(poemsSearchMaterialized.title, `%${sanitizedQuery}%`),
        ilike(poemsSearchMaterialized.poet_name, `%${sanitizedQuery}%`)
      );

      const countResult = await db
        .select({ count: sql`count(*)` })
        .from(poemsSearchMaterialized)
        .where(searchCondition);

      const totalResults = Number(countResult[0]?.count || 0);
      const totalPages = Math.ceil(totalResults / limit);

      if (totalResults === 0) {
        // Return empty results directly
        return c.json({
          success: true,
          data: {
            results: [],
            pagination: {
              currentPage: page,
              totalPages: 0,
              totalResults: 0,
              hasNextPage: false,
              hasPrevPage: page > 1,
            },
          },
        });
      }

      const searchResults = await db
        .select({
          id: poemsSearchMaterialized.id,
          title: poemsSearchMaterialized.title,
          slug: poemsSearchMaterialized.slug,
          content_snippet: sql`
            CASE 
              WHEN ${poemsSearchMaterialized.content_tsv} @@ plainto_tsquery('arabic', ${sanitizedQuery})
              THEN ts_headline('arabic', ${poemsSearchMaterialized.content}, plainto_tsquery('arabic', ${sanitizedQuery}), 'MaxFragments=1, MaxWords=30, MinWords=15, StartSel="", StopSel=""')
              WHEN position(lower(${sanitizedQuery}) in lower(${poemsSearchMaterialized.content})) > 0 
              THEN substring(
                ${poemsSearchMaterialized.content} 
                from greatest(1, position(lower(${sanitizedQuery}) in lower(${poemsSearchMaterialized.content})) - 50) 
                for 200
              )
              ELSE substring(${poemsSearchMaterialized.content} from 1 for 150)
            END
          `.as("content_snippet"),
          poet_name: poemsSearchMaterialized.poet_name,
          poet_slug: poemsSearchMaterialized.poet_slug,
          meter_name: poemsSearchMaterialized.meter_name,
          era_name: poemsSearchMaterialized.era_name,
        })
        .from(poemsSearchMaterialized)
        .where(searchCondition)
        .orderBy(
          sql`
            CASE 
              WHEN ${poemsSearchMaterialized.title} ILIKE ${`%${sanitizedQuery}%`} THEN 1
              WHEN ${poemsSearchMaterialized.poet_name} ILIKE ${`%${sanitizedQuery}%`} THEN 2
              ELSE 3
            END
          `
        )
        .limit(limit)
        .offset(offset);

      const formattedResults = searchResults.map((result) => ({
        id: Number(result.id),
        title: String(result.title || ""),
        slug: String(result.slug || ""),
        content_snippet: String(result.content_snippet || ""),
        poet_name: String(result.poet_name || ""),
        poet_slug: String(result.poet_slug || ""),
        meter_name: result.meter_name ? String(result.meter_name) : null,
        era_name: result.era_name ? String(result.era_name) : null,
      }));

      const paginationMeta = {
        currentPage: Number(page),
        totalPages: Number(totalPages),
        totalResults: Number(totalResults),
        hasNextPage: Boolean(page < totalPages),
        hasPrevPage: Boolean(page > 1),
      };

      return c.json(
        createValidatedResponse("search", {
          results: formattedResults,
          pagination: paginationMeta,
        })
      );
    } catch (error) {
      console.error("Search route error:", error);
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          status: 500,
        },
        500
      );
    }
  }
);

export default app;
