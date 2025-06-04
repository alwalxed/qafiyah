import { z } from "zod";

const positiveIntSchema = z.number().int().positive();
const nonNegativeIntSchema = z.number().int().nonnegative();
const stringMinOneSchema = z.string().min(1);
const uuidStringSchema = z.string().uuid();

const POSITIVE_NUMBER_REGEX = /^\d+$/;

export const pageStringNumberSchema = z.preprocess((val) => {
  if (typeof val !== "string") return 1;
  const num = parseInt(val, 10);
  return isNaN(num) || num <= 0 ? 1 : num;
}, positiveIntSchema);

export const paginationSchema = z.object({
  page: pageStringNumberSchema,
});

export const slugSchema = z.object({
  slug: stringMinOneSchema,
});

export const uuidSlugStringSchema = z.object({
  slug: uuidStringSchema,
});

export const paginatedSlugSchema = slugSchema.extend({
  page: z
    .string()
    .regex(POSITIVE_NUMBER_REGEX, { message: "Page must be a positive number" })
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: "Page must be a positive number" })
    .default("1"),
});

export const paginationMetaSchema = z.object({
  pagination: z.object({
    currentPage: positiveIntSchema,
    totalPages: nonNegativeIntSchema,
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
    totalItems: nonNegativeIntSchema.optional(),
  }),
});

export const createSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z.record(z.string(), z.unknown()).optional(),
  });

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  status: nonNegativeIntSchema,
});

export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([ createSuccessResponseSchema(dataSchema), errorResponseSchema ]);

export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  createSuccessResponseSchema(dataSchema).extend({
    meta: paginationMetaSchema,
  });

// Backwards compatibility (deprecated - use factory functions)
export const successResponseSchema = createSuccessResponseSchema;
export const apiResponseSchema = createApiResponseSchema;
export const paginatedResponseSchema = createPaginatedResponseSchema;