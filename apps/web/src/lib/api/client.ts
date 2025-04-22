import { fetchWithValidation, validateParams } from '@qaf/zod-schemas/client';
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
 * API client factory for fetching data from the Qafiyah API using Hono client
 * with schema validation from @qaf/zod-schemas
 */
const apiClient = (baseUrl: string) => {
  return {
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
      let validParams;

      switch (searchType) {
        case 'poems': {
          validParams = validateParams('search', {
            q,
            search_type: searchType,
            page,
            match_type: matchType,
            meter_ids: meterIds,
            era_ids: eraIds,
            rhyme_ids: rhymeIds,
            theme_ids: themeIds,
          });
          break;
        }
        case 'poets': {
          validParams = validateParams('search', {
            q,
            search_type: searchType,
            page,
            match_type: matchType,
            era_ids: eraIds,
          });
          break;
        }
      }

      const searchParams = new URLSearchParams();

      switch (searchType) {
        case 'poems': {
          searchParams.append('q', validParams.q);
          searchParams.append('page', validParams.page);
          searchParams.append('search_type', validParams.search_type);
          searchParams.append('match_type', validParams.match_type);

          if (validParams.meter_ids) {
            searchParams.append('meter_ids', validParams.meter_ids);
          }

          if (validParams.era_ids) {
            searchParams.append('era_ids', validParams.era_ids);
          }
          if (validParams.rhyme_ids) {
            searchParams.append('rhyme_ids', validParams.rhyme_ids);
          }

          if (validParams.theme_ids) {
            searchParams.append('theme_ids', validParams.theme_ids);
          }
          break;
        }
        case 'poets': {
          searchParams.append('q', validParams.q);
          searchParams.append('page', validParams.page);
          searchParams.append('search_type', validParams.search_type);
          searchParams.append('match_type', validParams.match_type);

          if (validParams.era_ids) {
            searchParams.append('era_ids', validParams.era_ids);
          }
          break;
        }
      }

      const resSchema = searchType === 'poems' ? 'poemsSearch' : 'poetsSearch';

      const response = await fetchWithValidation(
        resSchema,
        `${baseUrl}/search?${searchParams.toString()}`
      );

      return {
        data: response.data,
        pagination: response.data.pagination,
      };
    },

    // Eras
    async getEras(): Promise<Era[]> {
      const response = await fetchWithValidation('erasList', `${baseUrl}/eras`);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },

    async getEraPoems(
      slug: string,
      page: string
    ): Promise<{ data: EraPoems; pagination?: PaginationMeta }> {
      // Validate parameters before sending
      const validParams = validateParams('getErasPoems', { slug, page });

      const response = await fetchWithValidation(
        'erasPoems',
        `${baseUrl}/eras/${validParams.slug}/page/${validParams.page}`
      );

      return {
        data: response.data,
        pagination: response.meta?.pagination,
      };
    },

    // Meters
    async getMeters(): Promise<Meter[]> {
      const response = await fetchWithValidation('metersList', `${baseUrl}/meters`);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },

    async getMeterPoems(
      slug: string,
      page: string
    ): Promise<{ data: MeterPoems; pagination?: PaginationMeta }> {
      // Validate parameters before sending
      const validParams = validateParams('getMetersPoems', { slug, page });

      const response = await fetchWithValidation(
        'metersPoems',
        `${baseUrl}/meters/${validParams.slug}/page/${validParams.page}`
      );

      return {
        data: response.data,
        pagination: response.meta?.pagination,
      };
    },

    // Poets
    async getPoets(page: string): Promise<{ data: PoetsData; pagination?: PaginationMeta }> {
      // Validate parameters before sending
      const validParams = validateParams('getPoets', { page });

      const response = await fetchWithValidation(
        'poetsList',
        `${baseUrl}/poets/page/${validParams.page}`
      );

      return {
        data: response.data,
        pagination: response.meta?.pagination,
      };
    },

    async getPoetPoems(
      slug: string,
      page: string
    ): Promise<{ data: PoetPoems; pagination?: PaginationMeta }> {
      // Validate parameters before sending
      const validParams = validateParams('getPoetPoems', { slug, page });

      const response = await fetchWithValidation(
        'poetPoems',
        `${baseUrl}/poets/${validParams.slug}/page/${validParams.page}`
      );

      return {
        data: response.data,
        pagination: response.meta?.pagination,
      };
    },

    // Poems
    async getPoem(slug: string): Promise<ProcessedPoem> {
      // Validate parameters before sending
      const validParams = validateParams('getPoemBySlug', { slug });

      const response = await fetchWithValidation(
        'poemDetail',
        `${baseUrl}/poems/slug/${validParams.slug}`
      );
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },

    async getRandomPoem(): Promise<string> {
      const response = await fetch(`${baseUrl}/poems/random`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.text();
    },

    // Rhymes
    async getRhymes(): Promise<Rhyme[]> {
      const response = await fetchWithValidation('rhymesList', `${baseUrl}/rhymes`);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },

    async getRhymePoems(
      slug: string,
      page: string
    ): Promise<{ data: RhymePoems; pagination?: PaginationMeta }> {
      // Validate parameters before sending
      const validParams = validateParams('getRhymesPoems', { slug, page });

      const response = await fetchWithValidation(
        'rhymesPoems',
        `${baseUrl}/rhymes/${validParams.slug}/page/${validParams.page}`
      );

      return {
        data: response.data,
        pagination: response.meta?.pagination,
      };
    },

    // Themes
    async getThemes(): Promise<Theme[]> {
      const response = await fetchWithValidation('themesList', `${baseUrl}/themes`);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },

    async getThemePoems(
      slug: string,
      page: string
    ): Promise<{ data: ThemePoems; pagination?: PaginationMeta }> {
      // Validate parameters before sending
      const validParams = validateParams('getThemesPoems', { slug, page });

      const response = await fetchWithValidation(
        'themesPoems',
        `${baseUrl}/themes/${validParams.slug}/page/${validParams.page}`
      );

      return {
        data: response.data,
        pagination: response.meta?.pagination,
      };
    },
  };
};

export default apiClient;
