import { z } from "zod";

const slug = z.string().min(1, "Slug is required");

const page = z.string().transform((val, ctx) => {
  const pageNum = parseInt(val, 10);
  if (isNaN(pageNum) || pageNum < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Page must be a positive number",
    });
    return z.NEVER;
  }
  return pageNum;
});

export const sluggedSchema = z.object({
  slug,
});

export const paginationSchema = z.object({
  page,
});

export const paginatedSlugSchema = z.object({
  slug,
  page,
});
