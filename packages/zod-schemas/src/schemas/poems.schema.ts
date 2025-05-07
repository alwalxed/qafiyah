import { z } from "zod";
import { apiResponseSchema, uuidSlugStringSchema } from "./common.schema";

// Schema for a poem's metadata
export const poemMetadataSchema = z.object({
  poet_name: z.string(),
  poet_slug: z.string(),
  era_name: z.string(),
  era_slug: z.string(),
  meter_name: z.string(),
  theme_name: z.string(),
});

// Schema for a processed poem verse
export const poemVerseSchema = z.tuple([z.string(), z.string()]);

// Schema for processed poem content
export const processedPoemContentSchema = z.object({
  verses: z.array(poemVerseSchema),
  verseCount: z.number().int().positive(),
  sample: z.string(),
  keywords: z.string(),
});

// Schema for related poems
export const relatedPoemSchema = z.object({
  poem_slug: z.string(),
  poet_name: z.string(),
  meter_name: z.string(),
  poem_title: z.string(),
});

// Schema for the poem detail response
export const poemDetailResponseSchema = apiResponseSchema(
  z.object({
    metadata: poemMetadataSchema,
    clearTitle: z.string(),
    processedContent: processedPoemContentSchema,
    related_poems: z.array(relatedPoemSchema).optional(),
  })
);

// Schema for random poem excerpt response
export const randomPoemExcerptSchema = z.string();

// Request schemas
export const getPoemBySlugRequestSchema = uuidSlugStringSchema;
export const getRandomPoemRequestSchema = z.object({
  option: z.enum(["lines", "slug"]).default("lines"),
});
