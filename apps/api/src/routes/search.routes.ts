import { zValidator } from "@hono/zod-validator";
import { searchRequestSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { Hono } from "hono";
import postgres from "postgres";
import type { AppContext } from "../types";

const app = new Hono<AppContext>().get(
  "/",
  zValidator("query", searchRequestSchema),
  async (c) => {
    try {
      const { q, page, exact } = c.req.valid("query");
      const exactMatch = exact === "true";

      const sqlClient = postgres(c.env.SEARCH_DATABASE_URL, {
        prepare: false,
        max: 3,
        idle_timeout: 20,
        connect_timeout: 10,
        fetch_types: false,
      });

      const sanitizedQuery = q
        .trim()
        .replace(
          /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0621-\u064A\s]/g,
          ""
        )
        .replace(/\s+/g, " ")
        .trim();

      if (!sanitizedQuery) {
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

      const searchResults = await sqlClient`
  SELECT * FROM search_poems(${sanitizedQuery}, ${page}, ${exactMatch})
`;

      // Get the total count from the first result (all rows have the same total_result_count)
      const totalResults =
        searchResults.length > 0
          ? Number(searchResults[0]?.total_result_count)
          : 0;
      const resultsPerPage = 5; // This should match the value in your search_poems function
      const totalPages = Math.ceil(totalResults / resultsPerPage);

      const formattedResults = searchResults.map((result: any) => ({
        id: result.id ?? null,
        title: result.poem_title ?? null,
        slug: result.poem_slug ?? null,
        content_snippet: result.poem_snippet ?? null,
        poet_name: result.poet_name ?? null,
        poet_slug: result.poet_slug ?? null,
        meter_name: result.poem_meter ?? null,
        era_name: result.poet_era ?? null,
      }));

      const pagination = {
        currentPage: page,
        totalPages: totalPages,
        totalResults: totalResults,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };

      const data = {
        results: formattedResults,
        pagination,
      };

      const response = createValidatedResponse("search", data);

      return c.json(response);
    } catch (error) {
      console.error("Search error:", error);

      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

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
