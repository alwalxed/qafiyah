import { zValidator } from "@hono/zod-validator";
import { searchRequestSchema, searchResultSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
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
        // Return empty results with pagination
        const emptyResponse = createValidatedResponse("search", {
          results: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalResults: 0,
            hasNextPage: false,
            hasPrevPage: page > 1,
          },
        });

        return c.json(emptyResponse);
      }

      // Execute search query
      const searchResults = await db.execute(
        sql`SELECT * FROM search_poems(${searchQuery}::text, ${page}::int, ${MAX_RESULTS_PER_PAGE}::int)`
      );

      // Get total count
      const countResult = await db.execute(
        sql`SELECT count_search_poems(${searchQuery}::text) as total`
      );

      // Extract the total count safely
      let totalResults = 0;
      if (countResult?.rows?.[0]?.total !== undefined) {
        totalResults = Number(countResult.rows[0].total);
      }

      const totalPages = Math.ceil(totalResults / MAX_RESULTS_PER_PAGE);

      // Format and validate results
      const formattedResults = [];

      if (searchResults?.rows?.length) {
        for (const result of searchResults.rows) {
          try {
            // Parse each result through the schema
            const validatedResult = searchResultSchema.parse({
              id: Number(result.id || 0),
              title: String(result.title || ""),
              slug: String(result.slug || ""),
              content_snippet: String(result.content_snippet || ""),
              poet_name: String(result.poet_name || ""),
              poet_slug: String(result.poet_slug || ""),
              meter_name: result.meter_name ? String(result.meter_name) : null,
              era_name: result.era_name ? String(result.era_name) : null,
            });

            formattedResults.push(validatedResult);
          } catch (parseError) {
            console.error("Failed to validate search result:", parseError);
            // Skip invalid results instead of failing the entire request
          }
        }
      }

      // Create pagination metadata
      const paginationMeta = {
        currentPage: Number(page),
        totalPages: Number(totalPages),
        totalResults: Number(totalResults),
        hasNextPage: Boolean(page < totalPages),
        hasPrevPage: Boolean(page > 1),
      };

      // Create and validate the response using the utility
      const response = createValidatedResponse("search", {
        results: formattedResults,
        pagination: paginationMeta,
      });

      return c.json(response);
    } catch (error) {
      console.error("Search route error:", error);

      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      // Return a structured error response
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
