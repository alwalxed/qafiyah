import { zValidator } from "@hono/zod-validator";
import {
  poemsSearchRequestSchema,
  poetsSearchRequestSchema,
} from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import type { AppContext } from "../types";
import { parseIds } from "../utils/number";
import { cleanArabicQuery } from "../utils/text";

const app = new Hono<AppContext>()
  .get("/poems", zValidator("query", poemsSearchRequestSchema), async (c) => {
    const { q, page, match_type, meter_ids, era_ids, theme_ids } =
      c.req.valid("query");

    const db = c.get("db");
    const sanitizedQuery = cleanArabicQuery(q);

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

    const meterIds = parseIds(meter_ids);
    const eraIds = parseIds(era_ids);
    const themeIds = parseIds(theme_ids);

    const dbResult = await db.execute(
      sql`SELECT * FROM search_poems(
        ${sanitizedQuery}::TEXT,
        ${page}::INTEGER,
        ${match_type}::TEXT,
        ${meterIds}::INTEGER[],
        ${eraIds}::INTEGER[],
        ${themeIds}::INTEGER[])`
    );

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
    const resultsPerPage = 5; // Matches the value in the SQL function see https://github.com/alwalxed/qafiyah/blob/main/notes/features/SEARCH.md for postgres implementation
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    const formattedResults = results.map((r) => ({
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

    const responseData = {
      results: formattedResults,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    return c.json(createValidatedResponse("poemsSearch", responseData));
  })
  .get("/poets", zValidator("query", poetsSearchRequestSchema), async (c) => {
    const { q, page, match_type, era_ids } = c.req.valid("query");

    const db = c.get("db");

    const sanitizedQuery = cleanArabicQuery(q);

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

    const eraIds = parseIds(era_ids);

    const dbResult = await db.execute(
      sql`SELECT * FROM search_poets(
      ${sanitizedQuery}::TEXT,
      ${page}::INTEGER,
      ${match_type}::TEXT,
      ${eraIds}::INTEGER[])`
    );

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
    const resultsPerPage = 10; // Matches the value in the SQL function see https://github.com/alwalxed/qafiyah/blob/main/notes/features/SEARCH.md for postgres implementation
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    // Fixed the type annotation by removing the inline type
    const formattedResults = results.map((r) => ({
      poet_name: r.poet_name,
      poet_era: r.poet_era,
      poet_slug: r.poet_slug,
      poet_bio: r.poet_bio,
      relevance: r.relevance,
      total_count: r.total_count,
    }));

    const responseData = {
      results: formattedResults,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
    return c.json(createValidatedResponse("poetsSearch", responseData));
  });

export default app;
