import { zValidator } from "@hono/zod-validator";
import { searchRequestSchema } from "@qaf/zod-schemas";
import { createValidatedResponse } from "@qaf/zod-schemas/server";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { AppContext } from "../types";
import { log } from "../utils/devlopment";
import { logger } from "../utils/logger";
import { parseIds } from "../utils/number";
import { cleanArabicQuery } from "../utils/text";

type ErrorTypeDefinition = {
  code: ContentfulStatusCode;
  type: string;
};

type ErrorTypeKey =
  | "VALIDATION"
  | "EMPTY_QUERY"
  | "INVALID_SEARCH_TYPE"
  | "INVALID_POEM_QUERY"
  | "INVALID_POET_QUERY"
  | "SERVER_ERROR";

const ERROR_TYPES: Record<ErrorTypeKey, ErrorTypeDefinition> = {
  VALIDATION: {
    code: 400,
    type: "VALIDATION_ERROR",
  },
  EMPTY_QUERY: {
    code: 400,
    type: "EMPTY_QUERY",
  },
  INVALID_SEARCH_TYPE: {
    code: 400,
    type: "INVALID_SEARCH_TYPE",
  },
  INVALID_POEM_QUERY: {
    code: 400,
    type: "INVALID_POEM_QUERY",
  },
  INVALID_POET_QUERY: {
    code: 400,
    type: "INVALID_POET_QUERY",
  },
  SERVER_ERROR: {
    code: 500,
    type: "SERVER_ERROR",
  },
};

const app = new Hono<AppContext>().get(
  "/",
  zValidator("query", searchRequestSchema),
  async (c) => {
    try {
      const {
        // required
        q,
        search_type,
        page,
        match_type,
        // optional
        meter_ids,
        era_ids,
        rhyme_ids,
        theme_ids,
      } = c.req.valid("query");

      const db = c.get("db");
      const sanitizedQuery = decodeURIComponent(cleanArabicQuery(q));

      if (!sanitizedQuery) {
        log(c, `sanitizedQuery`);
        throw new HTTPException(ERROR_TYPES.EMPTY_QUERY.code, {
          message: "لا نقل إلا الحروف العربية",
        });
      }

      const meterIds = parseIds(meter_ids);
      const eraIds = parseIds(era_ids);
      const rhymeIds = parseIds(rhyme_ids);
      const themeIds = parseIds(theme_ids);

      let dbResult;

      switch (search_type) {
        case "poems": {
          dbResult = await db.execute(
            sql`SELECT * FROM search_poems(
              ${sanitizedQuery}::TEXT,
              ${page}::INTEGER,
              ${match_type}::TEXT,
              ${meterIds ? sql`${meterIds}::INTEGER[]` : sql`NULL::INTEGER[]`},
              ${eraIds ? sql`${eraIds}::INTEGER[]` : sql`NULL::INTEGER[]`},
              ${themeIds ? sql`${themeIds}::INTEGER[]` : sql`NULL::INTEGER[]`},
              ${rhymeIds ? sql`${rhymeIds}::INTEGER[]` : sql`NULL::INTEGER[]`}
            )`
          );
          break;
        }
        case "poets": {
          dbResult = await db.execute(
            sql`SELECT * FROM search_poets(
              ${sanitizedQuery}::TEXT,
              ${page}::INTEGER,
              ${match_type}::TEXT,
              ${eraIds ? sql`${eraIds}::INTEGER[]` : sql`NULL::INTEGER[]`}
            )`
          );
          break;
        }
        default: {
          log(c, "Default Block");
          throw new HTTPException(ERROR_TYPES.INVALID_SEARCH_TYPE.code, {
            message: "نوع البحث غير صالح",
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
          log(c, "Default Block");
          throw new HTTPException(ERROR_TYPES.INVALID_SEARCH_TYPE.code, {
            message: "نوع البحث غير صالح",
          });
        }
      }

      const responseData = {
        results: formattedResults,
        pagination,
      };

      const resSchema = search_type === "poems" ? "poemsSearch" : "poetsSearch";
      return c.json(createValidatedResponse(resSchema, responseData));
    } catch (error) {
      // Handle unexpected errors
      if (!(error instanceof HTTPException)) {
        logger.error({ error });
        throw new HTTPException(ERROR_TYPES.SERVER_ERROR.code, {
          message: "حدث خطأ غير متوقع في الخادم",
        });
      }
      throw error;
    }
  }
);

export default app;
