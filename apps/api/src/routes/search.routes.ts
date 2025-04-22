import { zValidator } from "@hono/zod-validator";
import { searchQueriesSchema, searchRequestSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import type { AppContext } from "../types";
import { parseIds } from "../utils/number";
import { cleanArabicQuery } from "../utils/text";

const app = new Hono<AppContext>().get(
  "/",
  zValidator("query", searchRequestSchema),
  async (c) => {
    const {
      // required
      search_type,
      q,
      page,
      match_type,
      // optional
      meter_ids,
      era_ids,
      theme_ids,
    } = c.req.valid("query");

    const db = c.get("db");
    const sanitizedQuery = decodeURIComponent(cleanArabicQuery(q));

    if (!sanitizedQuery) {
      return c.json({
        success: false,
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

    let parsedQuery;

    switch (search_type) {
      case "poems": {
        const parsed = searchQueriesSchema.poems.safeParse(sanitizedQuery);
        if (!parsed.success) {
          return c.json({
            success: false,
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

        parsedQuery = parsed.data;
        break;
      }
      case "poets": {
        const parsed = searchQueriesSchema.poets.safeParse(sanitizedQuery);
        if (!parsed.success) {
          return c.json({
            success: false,
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

        parsedQuery = parsed.data;
        break;
      }
      default: {
        return c.json({
          success: false,
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
    }

    const meterIds = parseIds(meter_ids);
    const eraIds = parseIds(era_ids);
    const themeIds = parseIds(theme_ids);

    let dbResult;

    switch (search_type) {
      case "poems": {
        dbResult = await db.execute(
          sql`SELECT * FROM search_poems(
            ${parsedQuery}::TEXT,
            ${page}::INTEGER,
            ${match_type}::TEXT,
            ${meterIds}::INTEGER[],
            ${eraIds}::INTEGER[],
            ${themeIds}::INTEGER[])
          `
        );
        break;
      }
      case "poets": {
        dbResult = await db.execute(
          sql`SELECT * FROM search_poets(
            ${sanitizedQuery}::TEXT,
            ${page}::INTEGER,
            ${match_type}::TEXT,
            ${eraIds}::INTEGER[])
          `
        );
        break;
      }
      default: {
        return c.json({
          success: false,
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
    }

    const results = dbResult.rows || [];

    if (results.length === 0 && results !== undefined) {
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

    const totalResults =
      results.length > 0 && results[0]?.total_count
        ? Number(results[0].total_count)
        : 0;
    const resultsPerPage = search_type === "poems" ? 5 : 10;
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const pagination = {
      currentPage: page,
      totalPages,
      totalResults,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    let formattedResults;

    switch (search_type) {
      case "poems": {
        formattedResults = results.map((r) => ({
          poet_name: r.poet_name,
          poet_era: r.poet_era,
          poet_slug: r.poet_slug,
          poem_title: r.poem_title,
          poem_snippet: r.poem_snippet,
          poem_meter: r.poem_meter,
          poem_slug: r.poem_slug,
          relevance: r.relevance,
          total_count: r.total_count,
        }));
        break;
      }
      case "poets": {
        formattedResults = results.map((r) => ({
          poet_name: r.poet_name,
          poet_era: r.poet_era,
          poet_slug: r.poet_slug,
          poet_bio: r.poet_bio,
          relevance: r.relevance,
          total_count: r.total_count,
        }));
        break;
      }
      default: {
        return c.json({
          success: false,
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
    }

    const responseData = {
      results: formattedResults,
      pagination,
    };

    const resSchema = search_type === "poems" ? "poemsSearch" : "poetsSearch";
    return c.json(createValidatedResponse(resSchema, responseData));
  }
);

export default app;
