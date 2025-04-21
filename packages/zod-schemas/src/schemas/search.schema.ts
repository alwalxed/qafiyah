import { z } from "zod";
import { pageStringNumberSchema } from "./common.schema";

/*
------------------------------------------------->
---------------- COMMON ---------------------->
------------------------------------------>
*/

const matchType = z.enum(["exact", "all", "any"]).default("all");

const parseIdList = z
  .string()
  .optional()
  .refine((val) => {
    if (val) {
      const ids = val.split(",").map((v) => v.trim());
      return ids.every(
        (id) =>
          Number.isInteger(Number.parseInt(id, 10)) &&
          Number.parseInt(id, 10) > 0
      );
    }
    return true;
  });

/*
------------------------------------------------->
---------------- POEMS ---------------------->
------------------------------------------>
*/

const poemsSearchQuery = z
  .string()
  .min(2, "Query must be at least 2 characters long")
  .refine((val) => {
    const words = val.trim().split(/\s+/); // Split by spaces
    return words.length >= 2 && words.every((word) => word.length >= 2);
  }, "Query must contain at least 2 words, each with at least 2 characters");

export const poemsSearchRequestSchema = z.object({
  q: poemsSearchQuery,
  page: pageStringNumberSchema,
  match_type: matchType,
  meter_ids: parseIdList,
  era_ids: parseIdList,
  theme_ids: parseIdList,
});

export const poemsSearchResultSchema = z.object({
  poet_name: z.string(),
  poet_era: z.string(),
  poet_slug: z.string(),
  poem_title: z.string(),
  poem_snippet: z.string(),
  poem_meter: z.string(),
  poem_slug: z.string(),
  relevance: z.number(),
  total_count: z
    .string()
    .or(z.number())
    .transform((val) =>
      typeof val === "string" ? Number.parseInt(val, 10) : val
    ),
});

export const poemsSearchResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    results: z.array(poemsSearchResultSchema),
    pagination: z.object({
      currentPage: z.number(),
      totalPages: z.number(),
      totalResults: z.number(),
      hasNextPage: z.boolean(),
      hasPrevPage: z.boolean(),
    }),
  }),
});

/*
------------------------------------------------->
---------------- POETS ---------------------->
------------------------------------------>
*/

export const poetsSearchRequestSchema = z.object({
  q: z.string().min(2, "Query must be at least 2 characters long"),
  page: pageStringNumberSchema,
  match_type: matchType,
  era_ids: parseIdList,
});

export const poetsSearchResultSchema = z.object({
  poet_name: z.string(),
  poet_era: z.string(),
  poet_slug: z.string(),
  poet_bio: z.string(),
  relevance: z.number(),
  total_count: z
    .string()
    .or(z.number())
    .transform((val) =>
      typeof val === "string" ? Number.parseInt(val, 10) : val
    ),
});

export const poetsSearchResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    results: z.array(poetsSearchResultSchema),
    pagination: z.object({
      currentPage: z.number(),
      totalPages: z.number(),
      totalResults: z.number(),
      hasNextPage: z.boolean(),
      hasPrevPage: z.boolean(),
    }),
  }),
});
