import { z } from "zod";

export const pageStringNumberSchema = z.preprocess((val) => {
  if (typeof val !== "string") return 1;
  const num = parseInt(val, 10);
  return isNaN(num) || num <= 0 ? 1 : num;
}, z.number().positive());

export const paginationSchema = z.object({
  page: pageStringNumberSchema,
});

export const slugSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export const paginatedSlugSchema = slugSchema.extend({
  page: z
    .string()
    .regex(/^\d+$/, { message: "Page must be a positive number" })
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: "Page must be a positive number" })
    .default("1"),
});

export const paginationMetaSchema = z.object({
  pagination: z.object({
    currentPage: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
    totalItems: z.number().int().nonnegative().optional(),
  }),
});

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z.record(z.string(), z.unknown()).optional(),
  });

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  status: z.number().int(),
});

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([successResponseSchema(dataSchema), errorResponseSchema]);

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  successResponseSchema(dataSchema).extend({
    meta: paginationMetaSchema,
  });
