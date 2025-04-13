/* eslint-disable @typescript-eslint/no-explicit-any */
import type { z } from "zod";
import type { ApiEndpoint, ApiResponseType } from "./validation";
import {
  getValidatedResponse,
  validateRequest,
  type responseSchemas,
} from "./validation";

/**
 * Helper function to fetch data from an API with validation
 * @param endpoint The API endpoint type
 * @param url The URL to fetch from
 * @param params Optional query parameters
 * @returns The validated response data
 */
export async function fetchWithValidation<T extends ApiResponseType>(
  endpoint: T,
  url: string,
  params?: Record<string, string>
): Promise<z.infer<(typeof responseSchemas)[T]>> {
  const queryString = params
    ? `?${new URLSearchParams(params).toString()}`
    : "";
  const response = await fetch(`${url}${queryString}`);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return getValidatedResponse(endpoint, data);
}

/**
 * Helper function to validate request parameters before sending
 * @param endpoint The API endpoint type
 * @param params The parameters to validate
 * @returns The validated parameters
 */
export function validateParams<T extends ApiEndpoint>(
  endpoint: T,
  params: unknown
): z.infer<any> {
  return validateRequest(endpoint, params);
}
