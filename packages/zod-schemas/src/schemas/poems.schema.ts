import { z } from "zod";
import { apiResponseSchema, slugSchema } from "./common.schema";

// Schema for a poem's metadata
export const poemMetadataSchema = z.object({
  poet_name: z.string(),
  poet_slug: z.string(),
  era_name: z.string(),
  era_slug: z.string(),
  meter_name: z.string(),
  theme_name: z.string(),
  type_name: z.string().optional(),
});

// Schema for a processed poem verse
export const poemVerseSchema = z.tuple([z.string(), z.string()]);

// Schema for processed poem content
export const processedPoemContentSchema = z.object({
  verses: z.array(poemVerseSchema),
  readTime: z.string(),
  verseCount: z.number().int().positive(),
  sample: z.string(),
  keywords: z.string(),
});

// Schema for the poem detail response
export const poemDetailResponseSchema = apiResponseSchema(
  z.object({
    data: poemMetadataSchema,
    clearTitle: z.string(),
    processedContent: processedPoemContentSchema,
  })
);

// Schema for random poem excerpt response
export const randomPoemExcerptSchema = z.string();

// Request schemas
export const getPoemBySlugRequestSchema = slugSchema;
