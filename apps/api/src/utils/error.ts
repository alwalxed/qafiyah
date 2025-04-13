import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ApiErrorResponse } from "../types";

/**
 * Creates a standardized error response
 * @param message Error message
 * @param status HTTP status code
 * @param additionalInfo Additional error information
 * @returns A standardized error response object
 */
export function createErrorResponse(
  message: string,
  status: number,
  additionalInfo?: Record<string, unknown>
): ApiErrorResponse {
  return {
    success: false,
    error: message,
    status,
    ...(additionalInfo || {}),
  };
}

/**
 * Sends a standard error response
 * @param c Hono context
 * @param message Error message
 * @param status HTTP status code
 * @param additionalInfo Additional error information
 * @returns Hono response with standardized format
 */
export function sendErrorResponse(
  c: Context,
  message: string,
  status: number,
  additionalInfo?: Record<string, unknown>
): Response {
  const response = createErrorResponse(message, status, additionalInfo);
  return c.json(response, status as ContentfulStatusCode);
}
