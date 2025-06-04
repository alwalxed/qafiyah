import type { z } from "zod";
import * as erasSchemas from "../schemas/eras.schema";
import * as metersSchemas from "../schemas/meters.schema";
import * as poemsSchemas from "../schemas/poems.schema";
import * as poetsSchemas from "../schemas/poets.schema";
import * as rhymesSchemas from "../schemas/rhymes.schema";
import * as searchSchemas from "../schemas/search.schema";
import * as themesSchemas from "../schemas/themes.schema";

export const requestSchemas = {
  getErasPoems: erasSchemas.getErasPoemsRequestSchema,
  getMetersPoems: metersSchemas.getMetersPoemsRequestSchema,
  getPoemBySlug: poemsSchemas.getPoemBySlugRequestSchema,
  getRandomPoem: poemsSchemas.getRandomPoemRequestSchema,
  getPoets: poetsSchemas.getPoetsRequestSchema,
  getPoetPoems: poetsSchemas.getPoetPoemsRequestSchema,
  getPoetInfo: poetsSchemas.getPoetRequestSchema,
  getRhymesPoems: rhymesSchemas.getRhymesPoemsRequestSchema,
  getThemesPoems: themesSchemas.getThemesPoemsRequestSchema,
  search: searchSchemas.searchRequestSchema,
} as const;

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

export type ApiEndpoint = keyof typeof requestSchemas;
export type ApiResponseType = keyof typeof responseSchemas;

const validationCache = new Map<string, boolean>();

export function validateRequest<T extends ApiEndpoint>(
  endpoint: T,
  params: unknown
): z.infer<(typeof requestSchemas)[ T ]> {
  const schema = requestSchemas[ endpoint ];
  if (!schema) {
    throw new Error(`No schema found for endpoint: ${ endpoint }`);
  }
  return schema.parse(params);
}

export function validateResponse<T extends ApiResponseType>(
  endpoint: T,
  data: unknown
): boolean {
  const cacheKey = `${ endpoint }-${ JSON.stringify(data) }`;
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)!;
  }

  const schema = responseSchemas[ endpoint ];
  if (!schema) {
    throw new Error(`No schema found for endpoint: ${ endpoint }`);
  }

  const result = schema.safeParse(data).success;

  if (validationCache.size < 1000) {
    validationCache.set(cacheKey, result);
  }

  return result;
}

export function getValidatedResponse<T extends ApiResponseType>(
  endpoint: T,
  data: unknown
): z.infer<(typeof responseSchemas)[ T ]> {
  const schema = responseSchemas[ endpoint ];
  if (!schema) {
    throw new Error(`No schema found for endpoint: ${ endpoint }`);
  }

  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid response data for endpoint: ${ endpoint }`);
  }
  return result.data;
}

export function clearValidationCache(): void {
  validationCache.clear();
}