import { z } from "zod";

// Common pagination schema used across multiple routes
export const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, { message: "Page must be a positive number" })
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: "Page must be a positive number" })
    .default("1"),
});

// Common slug parameter schema
export const slugSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

// Common paginated slug parameter schema (combines both)
export const paginatedSlugSchema = slugSchema.extend({
  page: z
    .string()
    .regex(/^\d+$/, { message: "Page must be a positive number" })
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: "Page must be a positive number" })
    .default("1"),
});

// Common pagination metadata in responses
export const paginationMetaSchema = z.object({
  pagination: z.object({
    currentPage: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
    totalItems: z.number().int().nonnegative().optional(),
  }),
});

// Base success response wrapper
export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z.record(z.string(), z.unknown()).optional(),
  });

// Base error response wrapper
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  status: z.number().int(),
});

// Generic API response (either success or error)
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([successResponseSchema(dataSchema), errorResponseSchema]);

// Paginated response wrapper
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  successResponseSchema(dataSchema).extend({
    meta: paginationMetaSchema,
  });
