import { zValidator } from "@hono/zod-validator";
import { searchRequestSchema } from "@qaf/zod-schemas";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import type { AppContext } from "../types";

const MAX_RESULTS_PER_PAGE = 10;

const app = new Hono<AppContext>().get(
  "/",
  zValidator("query", searchRequestSchema),
  async (c) => {
    try {
      const { q, page } = c.req.valid("query");
      const db = c.get("db");

      // Keep only Arabic letters and spaces, remove everything else
      const sanitizedQuery = q
        .trim()
        .replace(
          /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0621-\u064A\s]/g,
          ""
        )
        .replace(/\s+/g, " ")
        .trim();

      // Convert to tsquery format (words connected by &)
      const searchQuery = sanitizedQuery
        .split(/\s+/)
        .filter(Boolean)
        .join(" & ");

      if (!searchQuery) {
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

      const searchResults = await db.execute(
        sql`SELECT * FROM search_poems(${searchQuery}, ${page}, ${MAX_RESULTS_PER_PAGE})`
      );

      const countResult = await db.execute(
        sql`SELECT count_search_poems(${searchQuery}) as total`
      );

      const totalResults = Number((countResult as any)[0]?.total || 0);
      const totalPages = Math.ceil(totalResults / MAX_RESULTS_PER_PAGE);

      // Format results to match the schema
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

      // Create pagination metadata
      const paginationMeta = {
        currentPage: Number(page),
        totalPages: Number(totalPages),
        totalResults: Number(totalResults),
        hasNextPage: Boolean(page < totalPages),
        hasPrevPage: Boolean(page > 1),
      };

      // Return the response
      return c.json({
        success: true,
        data: {
          results: formattedResults,
          pagination: paginationMeta,
        },
      });
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
