import type { Context } from "hono";
import type { ApiSuccessResponse, PaginationMeta } from "../types";

/**
 * Creates a standardized success response
 * @param data The data to include in the response
 * @param meta Optional metadata (like pagination)
 * @returns A standardized success response object
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: Record<string, unknown>
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
}

/**
 * Sends a paginated response with standardized format
 * @param c Hono context
 * @param data The data to include in the response
 * @param pagination Pagination metadata
 * @returns Hono response with standardized format
 */
export function sendPaginatedResponse<T>(
  c: Context,
  data: T,
  pagination: PaginationMeta
): Response {
  const response = createSuccessResponse(data, { pagination });
  return c.json(response);
}

/**
 * Sends a standard success response
 * @param c Hono context
 * @param data The data to include in the response
 * @param meta Optional metadata
 * @returns Hono response with standardized format
 */
export function sendSuccessResponse<T>(
  c: Context,
  data: T,
  meta?: Record<string, unknown>
): Response {
  const response = createSuccessResponse(data, meta);
  return c.json(response);
}
