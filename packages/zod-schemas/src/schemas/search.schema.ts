import { z } from "zod";
import { pageStringNumberSchema } from "./common.schema";

/*
------------------------------------------------->
---------------- COMMON ---------------------->
------------------------------------------>
*/

const arabicRegex = /^[\u0600-\u06FF\s]+$/;

export const searchQueriesSchema = {
  poets: z.string().superRefine((val, ctx) => {
    // Early return for empty strings
    if (!val.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only Arabic letters are allowed",
      });
      return;
    }

    if (!arabicRegex.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only Arabic letters are allowed",
      });
      return;
    }

    // Split only once and reuse
    const words = val.trim().split(/\s+/);
    const wordCount = words.length;

    // Check length constraints
    if (wordCount === 1) {
      if (
        words !== undefined &&
        words[0] !== undefined &&
        words[0].length < 2
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Must be one word with at least 2 letters or multiple words totaling up to 50 letters",
        });
      }
    } else {
      // Calculate total length only once
      const totalLength = val.replace(/\s+/g, "").length;

      if (totalLength > 50 || words.some((w) => w.length < 1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Must be one word with at least 2 letters or multiple words totaling up to 50 letters",
        });
      }
    }
  }),

  poems: z.string().superRefine((val, ctx) => {
    // Early return for empty strings
    if (!val.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only Arabic letters are allowed",
      });
      return;
    }

    // Single regex test
    if (!arabicRegex.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only Arabic letters are allowed",
      });
      return;
    }

    // Split only once and reuse
    const words = val.trim().split(/\s+/);
    const wordCount = words.length;

    // Fast path for word count
    if (wordCount < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Must have at least 2 words, each ≥ 2 letters, and total letters ≤ 50",
      });
      return;
    }

    // Calculate total length only once
    const totalLength = val.replace(/\s+/g, "").length;

    if (totalLength > 50 || words.some((w) => w.length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Must have at least 2 words, each ≥ 2 letters, and total letters ≤ 50",
      });
    }
  }),
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
  q: z.string().min(2),
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
