import { z } from "zod";
import {
  apiResponseSchema,
  paginatedResponseSchema,
  paginatedSlugSchema,
} from "./common.schema";

// Schema for a single meter in the list
export const meterSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  poemsCount: z.number().int().nonnegative(),
  poetsCount: z.number().int().nonnegative(),
});

// Schema for the list of meters response
export const metersListResponseSchema = apiResponseSchema(z.array(meterSchema));

// Schema for a poem in the meter's poems list
export const meterPoemSchema = z.object({
  title: z.string(),
  slug: z.string(),
  poetName: z.string(),
});

// Schema for meter details
export const meterDetailsSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  poemsCount: z.number().int().nonnegative(),
});

// Schema for meter with poems response
export const meterPoemsResponseSchema = paginatedResponseSchema(
  z.object({
    meterDetails: meterDetailsSchema,
    poems: z.array(meterPoemSchema),
  })
);

// Request schemas
export const getMetersPoemsRequestSchema = paginatedSlugSchema;
