import { z } from "zod";

export const searchRequestSchema = z.object({
  q: z.string().min(1).max(100),
  page: z.coerce.number().int().positive().default(1),
  exact: z.enum(["true", "false"]).optional().default("false"),
});

export const searchResultSchema = z.object({
  id: z.number().nullable(),
  title: z.string(),
  slug: z.string(),
  content_snippet: z.string(),
  poet_name: z.string(),
  poet_slug: z.string().nullable(),
  meter_name: z.string().nullable(),
  era_name: z.string().nullable(),
});

export const searchResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    results: z.array(searchResultSchema),
    pagination: z.object({
      currentPage: z.number(),
      totalPages: z.number(),
      totalResults: z.number(),
      hasNextPage: z.boolean(),
      hasPrevPage: z.boolean(),
    }),
  }),
});
