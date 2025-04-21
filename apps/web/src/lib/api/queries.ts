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
  async searchPoems(
    query: string,
    page = '1',
    matchType = 'all',
    meterIds?: string,
    eraIds?: string,
    themeIds?: string
  ): Promise<{ data: PoemsSearchResponseData; pagination?: PaginationMeta }> {
    return client.searchPoems(query, page, matchType, meterIds, eraIds, themeIds);
  },

  async searchPoets(
    query: string,
    page = '1',
    matchType = 'all',
    eraIds?: string
  ): Promise<{ data: PoetsSearchResponseData; pagination?: PaginationMeta }> {
    return client.searchPoets(query, page, matchType, eraIds);
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

  async getRandomPoem(): Promise<string> {
    return client.getRandomPoem();
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
  searchPoems,
  searchPoets,
  getEras,
  getEraPoems,
  getMeters,
  getMeterPoems,
  getPoets,
  getPoetPoems,
  getPoem,
  getRandomPoem,
  getRhymes,
  getRhymePoems,
  getThemes,
  getThemePoems,
  getSitemap,
} = queries;

// Default export for convenience
export default queries;
