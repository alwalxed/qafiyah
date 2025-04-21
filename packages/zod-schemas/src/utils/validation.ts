import type { z } from "zod";
import * as erasSchemas from "../schemas/eras.schema";
import * as metersSchemas from "../schemas/meters.schema";
import * as poemsSchemas from "../schemas/poems.schema";
import * as poetsSchemas from "../schemas/poets.schema";
import * as rhymesSchemas from "../schemas/rhymes.schema";
import * as searchSchemas from "../schemas/search.schema";
import * as themesSchemas from "../schemas/themes.schema";

/**
 * Validates API request parameters
 * @param endpoint The API endpoint
 * @param params The parameters to validate
 * @returns Validated parameters or throws an error
 */
export function validateRequest<T extends keyof typeof requestSchemas>(
  endpoint: T,
  params: unknown
): z.infer<(typeof requestSchemas)[T]> {
  const schema = requestSchemas[endpoint];
  if (!schema) {
    throw new Error(`No schema found for endpoint: ${endpoint}`);
  }

  return schema.parse(params);
}

/**
 * Validates API response data
 * @param endpoint The API endpoint
 * @param data The response data to validate
 * @returns Whether the data is valid
 */
export function validateResponse<T extends keyof typeof responseSchemas>(
  endpoint: T,
  data: unknown
): boolean {
  const schema = responseSchemas[endpoint];
  if (!schema) {
    throw new Error(`No schema found for endpoint: ${endpoint}`);
  }

  return schema.safeParse(data).success;
}

/**
 * Gets the parsed and validated response data
 * @param endpoint The API endpoint
 * @param data The response data to validate
 * @returns The validated data or throws an error
 */
export function getValidatedResponse<T extends keyof typeof responseSchemas>(
  endpoint: T,
  data: unknown
): z.infer<(typeof responseSchemas)[T]> {
  const schema = responseSchemas[endpoint];
  if (!schema) {
    throw new Error(`No schema found for endpoint: ${endpoint}`);
  }

  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid response data for endpoint: ${endpoint}`);
  }

  return result.data;
}

// Map of request validation schemas by endpoint
export const requestSchemas = {
  getErasPoems: erasSchemas.getErasPoemsRequestSchema,
  getMetersPoems: metersSchemas.getMetersPoemsRequestSchema,
  getPoemBySlug: poemsSchemas.getPoemBySlugRequestSchema,
  getPoets: poetsSchemas.getPoetsRequestSchema,
  getPoetPoems: poetsSchemas.getPoetPoemsRequestSchema,
  getPoetInfo: poetsSchemas.getPoetRequestSchema,
  getRhymesPoems: rhymesSchemas.getRhymesPoemsRequestSchema,
  getThemesPoems: themesSchemas.getThemesPoemsRequestSchema,
  poemsSearch: searchSchemas.poemsSearchRequestSchema,
  poetsSearch: searchSchemas.poetsSearchRequestSchema,
} as const;

// Map of response validation schemas by endpoint
export const responseSchemas = {
  erasList: erasSchemas.erasListResponseSchema,
  erasPoems: erasSchemas.eraPoemsResponseSchema,
  metersList: metersSchemas.metersListResponseSchema,
  metersPoems: metersSchemas.meterPoemsResponseSchema,
  poemDetail: poemsSchemas.poemDetailResponseSchema,
  randomPoemExcerpt: poemsSchemas.randomPoemExcerptSchema,
  poetsList: poetsSchemas.poetsListResponseSchema,
  poetPoems: poetsSchemas.poetPoemsResponseSchema,
  poetBasicInfo: poetsSchemas.poetBasicInfoResponseSchema,
  rhymesList: rhymesSchemas.rhymesListResponseSchema,
  rhymesPoems: rhymesSchemas.rhymePoemsResponseSchema,
  themesList: themesSchemas.themesListResponseSchema,
  themesPoems: themesSchemas.themePoemsResponseSchema,
  poemsSearch: searchSchemas.poemsSearchResponseSchema,
  poetsSearch: searchSchemas.poetsSearchResponseSchema,
} as const;

// Export types for use in application code
export type ApiEndpoint = keyof typeof requestSchemas;
export type ApiResponseType = keyof typeof responseSchemas;
