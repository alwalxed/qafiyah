'use client';

import { search } from '@/lib/api/queries';
import type { PoemsSearchResult, PoetsSearchResult } from '@/lib/api/types';
import { useInfiniteQuery as useTanstackInfiniteQuery } from '@tanstack/react-query';
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

interface UseInfiniteQueryOptions {
  initialSearchType: SearchType;
  initialMatchType: MatchType;
  queryKey: string;
}

export function useInfiniteQuery({
  initialSearchType,
  initialMatchType,
  queryKey,
}: UseInfiniteQueryOptions) {
  const [query, setQuery] = useSearchQuery();
  const [searchType, setSearchType] = useSearchType(initialSearchType);
  const [matchType, setMatchType] = useMatchType(initialMatchType);
  const [eraIds, setEraIds] = useEraIds();
  const [rhymeIds, setRhymeIds] = useRhymeIds();
  const [meterIds, setMeterIds] = useMeterIds();
  const [themeIds, setThemeIds] = useThemeIds();

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
  const infiniteQuery = useTanstackInfiniteQuery({
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

    setQuery,
    setSearchType,
    setMatchType,
    setEraIds,
    setRhymeIds,
    setMeterIds,
    setThemeIds,

    fetchNextPage: infiniteQuery.fetchNextPage,
  };
}
