/* eslint-disable @typescript-eslint/no-explicit-any */
import type { z } from "zod";
import type { ApiEndpoint, ApiResponseType } from "./validation";
import { requestSchemas, responseSchemas } from "./validation";

/**
 * Creates a validated API response
 * @param endpoint The API endpoint type
 * @param data The data to include in the response
 * @param meta Optional metadata
 * @returns A validated API response object
 */
export function createValidatedResponse<T extends ApiResponseType>(
  endpoint: T,
  data: z.infer<any>,
  meta?: Record<string, unknown>
): z.infer<any> {
  // Get the schema for this endpoint
  const schema = responseSchemas[endpoint];

  // For success responses, we need to wrap the data
  const response = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };

  // Validate the response before returning
  const result = schema.safeParse(response);
  if (!result.success) {
    throw new Error(`Invalid response structure for endpoint: ${endpoint}`);
  }

  return response;
}

/**
 * Validates request parameters on the server
 * @param endpoint The API endpoint type
 * @param params The parameters to validate
 * @returns The validated parameters or throws a validation error
 */
export function validateServerRequest<T extends ApiEndpoint>(
  endpoint: T,
  params: unknown
): z.infer<any> {
  const schema = requestSchemas[endpoint];
  const result = schema.safeParse(params);

  if (!result.success) {
    // Return a structured error that can be used in API responses
    const formattedErrors = result.error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    throw {
      status: 400,
      message: "Validation failed",
      errors: formattedErrors,
    };
  }

  return result.data;
}

// Re-export validation types and schemas for convenience
export { requestSchemas, responseSchemas };
export type { ApiEndpoint, ApiResponseType };
