import { z } from "zod";
import {
  paginatedResponseSchema,
  paginatedSlugSchema,
  paginationSchema,
} from "./common.schema";

// Schema for a single poet in the list
export const poetSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  eraId: z.number().int(),
  poemsCount: z.number().int().nonnegative(),
});

// Schema for the list of poets response
export const poetsListResponseSchema = paginatedResponseSchema(
  z.object({
    poets: z.array(poetSchema),
  })
);

// Schema for a poem in the poet's poems list
export const poetPoemSchema = z.object({
  title: z.string(),
  slug: z.string(),
  meter: z.string(),
});

// Schema for poet details
export const poetDetailsSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  poemsCount: z.number().int().nonnegative(),
});

// Schema for poet with poems response
export const poetPoemsResponseSchema = paginatedResponseSchema(
  z.object({
    poetDetails: poetDetailsSchema,
    poems: z.array(poetPoemSchema),
  })
);

// Request schemas
export const getPoetsRequestSchema = paginationSchema;
export const getPoetPoemsRequestSchema = paginatedSlugSchema;
