import { z } from "zod";
import {
  apiResponseSchema,
  paginatedResponseSchema,
  paginatedSlugSchema,
} from "./common.schema";

// Schema for a single era in the list
export const eraSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  poetsCount: z.number().int().nonnegative(),
  poemsCount: z.number().int().nonnegative(),
});

// Schema for the list of eras response
export const erasListResponseSchema = apiResponseSchema(z.array(eraSchema));

// Schema for a poem in the era's poems list
export const eraPoemSchema = z.object({
  title: z.string(),
  slug: z.string(),
  poetName: z.string(),
  meter: z.string(),
});

// Schema for era details
export const eraDetailsSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  poemsCount: z.number().int().nonnegative(),
});

// Schema for era with poems response
export const eraPoemsResponseSchema = paginatedResponseSchema(
  z.object({
    eraDetails: eraDetailsSchema,
    poems: z.array(eraPoemSchema),
  })
);

// Request schemas
export const getErasPoemsRequestSchema = paginatedSlugSchema;
