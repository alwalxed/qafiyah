import { z } from "zod";
import {
  apiResponseSchema,
  paginatedResponseSchema,
  paginatedSlugSchema,
} from "./common.schema";

// Schema for a single rhyme in the list
export const rhymeSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  poetsCount: z.number().int().nonnegative(),
  poemsCount: z.number().int().nonnegative(),
  totalUsage: z.number().int().nonnegative(),
});

// Schema for the list of rhymes response
export const rhymesListResponseSchema = apiResponseSchema(z.array(rhymeSchema));

// Schema for a poem in the rhyme's poems list
export const rhymePoemSchema = z.object({
  title: z.string(),
  slug: z.string(),
  meter: z.string(),
});

// Schema for rhyme details
export const rhymeDetailsSchema = z.object({
  id: z.number().int(),
  pattern: z.string(),
  poemsCount: z.number().int().nonnegative(),
});

// Schema for rhyme with poems response
export const rhymePoemsResponseSchema = paginatedResponseSchema(
  z.object({
    rhymeDetails: rhymeDetailsSchema,
    poems: z.array(rhymePoemSchema),
  })
);

// Request schemas
export const getRhymesPoemsRequestSchema = paginatedSlugSchema;
