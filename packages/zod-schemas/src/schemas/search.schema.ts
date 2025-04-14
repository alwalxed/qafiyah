import { z } from "zod";

// Schema for search request
export const searchRequestSchema = z.object({
  q: z.string().min(1).max(100),
  page: z.coerce.number().int().positive().default(1),
});

export const searchResultSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(), // Make sure this is the right type (string or UUID)
  content_snippet: z.string(),
  poet_name: z.string(),
  poet_slug: z.string(),
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
