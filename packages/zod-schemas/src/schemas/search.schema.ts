import { z } from "zod";
import { pageStringNumberSchema } from "./common.schema";

/*
------------------------------------------------->
---------------- COMMON ---------------------->
------------------------------------------>
*/

const arabicRegex = /^[\u0600-\u06FF\s]+$/;

export const searchQueriesSchema = {
  poets: z
    .string()
    .refine((val) => arabicRegex.test(val), "Only Arabic letters are allowed")
    .refine(
      (val) => val.trim().length >= 2,
      "Query must be at least 2 characters long"
    )
    .refine(
      (val) => val.trim().split(/\s+/).length === 1,
      "Poet name must be one word"
    ),

  poems: z
    .string()
    .refine((val) => arabicRegex.test(val), "Only Arabic letters are allowed")
    .refine(
      (val) => val.trim().length >= 2,
      "Query must be at least 2 characters long"
    )
    .refine((val) => {
      const words = val.trim().split(/\s+/);
      return words.length >= 2 && words.every((word) => word.length >= 2);
    }, "Query must contain at least 2 words, each with at least 2 characters"),
};

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

export const searchRequestSchema = z.object({
  // always required
  q: z.string().min(2).max(50),
  page: pageStringNumberSchema,
  search_type: z.enum(["poems", "poets"]),
  match_type: z.enum(["exact", "all", "any"]),
  // optional
  meter_ids: parseIdList,
  era_ids: parseIdList,
  rhyme_ids: parseIdList,
  theme_ids: parseIdList,
});

/*
------------------------------------------------->
---------------- POEMS ---------------------->
------------------------------------------>
*/

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
