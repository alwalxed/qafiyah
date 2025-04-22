'use client';

import { search } from '@/lib/api/queries';
import type { PoemsSearchResult, PoetsSearchResult } from '@/lib/api/types';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  useEraIds,
  useMatchType,
  useMeterIds,
  useRhymeIds,
  useSearchQuery,
  useSearchType,
  useThemeIds,
  type MatchType,
  type SearchType,
} from './use-search-params';

interface UseInfiniteSearchOptions {
  initialSearchType: SearchType;
  initialMatchType: MatchType;
  queryKey: string;
}

export function useInfiniteSearch({
  initialSearchType,
  initialMatchType,
  queryKey,
}: UseInfiniteSearchOptions) {
  const [query, setQuery] = useSearchQuery();
  const [searchType, setSearchType] = useSearchType(initialSearchType);
  const [matchType, setMatchType] = useMatchType(initialMatchType);
  const [eraIds, setEraIds] = useEraIds();
  const [rhymeIds, setRhymeIds] = useRhymeIds();
  const [meterIds, setMeterIds] = useMeterIds();
  const [themeIds, setThemeIds] = useThemeIds();

  const queryClient = useQueryClient();

  // Create a memoized search params object for dependency tracking
  const currentSearchParams = useMemo(
    () => ({
      q: query,
      search_type: searchType,
      match_type: matchType,
      meter_ids: meterIds,
      era_ids: eraIds,
      rhyme_ids: rhymeIds,
      theme_ids: themeIds,
    }),
    [query, searchType, matchType, meterIds, eraIds, rhymeIds, themeIds]
  );

  // Set up the infinite query
  const infiniteQuery = useInfiniteQuery({
    queryKey: [queryKey, currentSearchParams],
    queryFn: async ({ pageParam = 1 }) => {
      // Don't perform search if query is empty
      if (!query) {
        return {
          data: { results: [] },
          pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: 10 },
        };
      }

      return search({
        q: query,
        searchType,
        page: String(pageParam),
        matchType,
        meterIds: meterIds && meterIds.length > 0 ? meterIds : undefined,
        eraIds: eraIds && eraIds.length > 0 ? eraIds : undefined,
        rhymeIds: rhymeIds && rhymeIds.length > 0 ? rhymeIds : undefined,
        themeIds: themeIds && themeIds.length > 0 ? themeIds : undefined,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      if (!pagination) return undefined;

      return pagination.currentPage < pagination.totalPages
        ? pagination.currentPage + 1
        : undefined;
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Function to perform a new search
  const performSearch = (params: {
    q?: string;
    search_type?: SearchType;
    match_type?: MatchType;
    era_ids?: string;
    rhyme_ids?: string;
    meter_ids?: string;
    theme_ids?: string;
  }) => {
    queryClient.resetQueries({ queryKey: [queryKey] });

    if (params.q !== undefined) {
      setQuery(params.q === '' ? null : params.q);
    }

    if (params.search_type !== undefined) {
      setSearchType(params.search_type);
    }

    if (params.match_type !== undefined) {
      setMatchType(params.match_type);
    }

    if (params.era_ids !== undefined) {
      setEraIds(params.era_ids || null);
    }

    if (params.rhyme_ids !== undefined) {
      setRhymeIds(params.rhyme_ids || null);
    }

    if (params.meter_ids !== undefined) {
      setMeterIds(params.meter_ids || null);
    }

    if (params.theme_ids !== undefined) {
      setThemeIds(params.theme_ids || null);
    }
  };

  const flatData = useMemo(() => {
    return (
      (infiniteQuery.data?.pages.flatMap((page) =>
        (page.data.results || []).map((result) => ({
          type: searchType === 'poems' ? 'poem' : 'poet',
          ...result,
        }))
      ) as (PoemsSearchResult | PoetsSearchResult)[]) || []
    );
  }, [infiniteQuery.data?.pages, searchType]);

  const paginationInfo = useMemo(() => {
    return infiniteQuery.data?.pages[infiniteQuery.data.pages.length - 1]?.pagination;
  }, [infiniteQuery.data?.pages]);

  return {
    isLoading: infiniteQuery.isLoading,
    isFetching: infiniteQuery.isFetching,
    isError: infiniteQuery.isError,
    isSuccess: infiniteQuery.isSuccess,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    hasNextPage: infiniteQuery.hasNextPage,

    searchType,
    searchParams: currentSearchParams,

    data: flatData,
    pagination: paginationInfo,
    error: infiniteQuery.error,

    performSearch,
    fetchNextPage: infiniteQuery.fetchNextPage,
  };
}
