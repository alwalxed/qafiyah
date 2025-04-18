import { z } from "zod";
import {
  paginatedResponseSchema,
  paginatedSlugSchema,
  paginationSchema,
  slugSchema,
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
  numVerses: z.number(),
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
export const poetEraSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

// Schema for basic poet info response
export const poetBasicInfoSchema = z.object({
  poet: z.object({
    name: z.string(),
    poemsCount: z.number().int().nonnegative(),
    era: poetEraSchema.nullable(),
  }),
});

// Schema for the poet basic info response
export const poetBasicInfoResponseSchema = z.object({
  success: z.literal(true),
  data: poetBasicInfoSchema,
});

// Request schemas
export const getPoetsRequestSchema = paginationSchema;
export const getPoetPoemsRequestSchema = paginatedSlugSchema;
export const getPoetRequestSchema = slugSchema;
