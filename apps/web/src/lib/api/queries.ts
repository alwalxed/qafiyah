import client from './hc';
import type {
  Era,
  EraPoems,
  Meter,
  MeterPoems,
  PaginationMeta,
  PoemsSearchResponseData,
  PoetPoems,
  PoetsData,
  PoetsSearchResponseData,
  ProcessedPoem,
  Rhyme,
  RhymePoems,
  Theme,
  ThemePoems,
} from './types';

/**
 * API queries for fetching data from the Qafiyah API
 * using the validated client
 */

export const queries = {
  // Search
  async search({
    q,
    searchType,
    page = '1',
    matchType = 'all',
    meterIds,
    eraIds,
    rhymeIds,
    themeIds,
  }: {
    q: string;
    searchType: 'poems' | 'poets';
    page: string;
    matchType: string;
    meterIds?: string;
    eraIds?: string;
    rhymeIds?: string;
    themeIds?: string;
  }): Promise<{
    data: PoemsSearchResponseData | PoetsSearchResponseData;
    pagination?: PaginationMeta;
  }> {
    return client.search({ q, searchType, page, matchType, meterIds, eraIds, rhymeIds, themeIds });
  },

  // Random Lines
  async getRandomLines(): Promise<string> {
    return client.getRandomLines();
  },

  // Random Slug
  async getRandomSlug(): Promise<string> {
    return client.getRandomSlug();
  },

  // Eras
  async getEras(): Promise<Era[]> {
    return client.getEras();
  },

  async getEraPoems(
    slug: string,
    page: string
  ): Promise<{ data: EraPoems; pagination?: PaginationMeta }> {
    return client.getEraPoems(slug, page);
  },

  // Meters
  async getMeters(): Promise<Meter[]> {
    return client.getMeters();
  },

  async getMeterPoems(
    slug: string,
    page: string
  ): Promise<{ data: MeterPoems; pagination?: PaginationMeta }> {
    return client.getMeterPoems(slug, page);
  },

  // Poets
  async getPoets(page: string): Promise<{ data: PoetsData; pagination?: PaginationMeta }> {
    return client.getPoets(page);
  },

  async getPoetPoems(
    slug: string,
    page: string
  ): Promise<{ data: PoetPoems; pagination?: PaginationMeta }> {
    return client.getPoetPoems(slug, page);
  },

  // Poems
  async getPoem(slug: string): Promise<ProcessedPoem> {
    return client.getPoem(slug);
  },

  // Rhymes
  async getRhymes(): Promise<Rhyme[]> {
    return client.getRhymes();
  },

  async getRhymePoems(
    slug: string,
    page: string
  ): Promise<{ data: RhymePoems; pagination?: PaginationMeta }> {
    return client.getRhymePoems(slug, page);
  },

  // Themes
  async getThemes(): Promise<Theme[]> {
    return client.getThemes();
  },

  async getThemePoems(
    slug: string,
    page: string
  ): Promise<{ data: ThemePoems; pagination?: PaginationMeta }> {
    return client.getThemePoems(slug, page);
  },

  // Sitemaps (assuming you need this based on your routes)
  async getSitemap(type: string): Promise<string> {
    const response = await fetch(`${client.baseUrl}/sitemaps/${type}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return response.text();
  },
};

// For convenience, also export individual functions
export const {
  search,
  getRandomLines,
  getRandomSlug,
  getEras,
  getEraPoems,
  getMeters,
  getMeterPoems,
  getPoets,
  getPoetPoems,
  getPoem,
  getRhymes,
  getRhymePoems,
  getThemes,
  getThemePoems,
  getSitemap,
} = queries;

// Default export for convenience
export default queries;
