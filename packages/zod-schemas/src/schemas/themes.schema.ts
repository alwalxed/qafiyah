import { z } from "zod";
import {
  apiResponseSchema,
  paginatedResponseSchema,
  paginatedSlugSchema,
} from "./common.schema";

// Schema for a single theme in the list
export const themeSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  poemsCount: z.number().int().nonnegative(),
  poetsCount: z.number().int().nonnegative(),
});

// Schema for the list of themes response
export const themesListResponseSchema = apiResponseSchema(z.array(themeSchema));

// Schema for a poem in the theme's poems list
export const themePoemSchema = z.object({
  title: z.string(),
  slug: z.string(),
  poetName: z.string(),
  meter: z.string(),
});

// Schema for theme details
export const themeDetailsSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  poemsCount: z.number().int().nonnegative(),
});

// Schema for theme with poems response
export const themePoemsResponseSchema = paginatedResponseSchema(
  z.object({
    themeDetails: themeDetailsSchema,
    poems: z.array(themePoemSchema),
  })
);

// Request schemas
export const getThemesPoemsRequestSchema = paginatedSlugSchema;
