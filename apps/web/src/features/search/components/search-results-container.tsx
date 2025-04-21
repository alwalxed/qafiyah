'use client';

import type { PaginationMeta, PoemsSearchResponseData } from '@/lib/api/types';
import { isArabicText } from '@/utils/texts/is-arabic-text';
import type { InfiniteData } from '@tanstack/react-query';
import type { SearchResult } from '../hooks/use-poem-search';
import { SearchResultsList } from './search-results';
import { ErrorState, LoadingState, NoResults } from './search-states';

type SearchResultsContainerProps = {
  query: string;
  status: string;
  data:
    | InfiniteData<
        {
          data: PoemsSearchResponseData;
          pagination?: PaginationMeta;
        },
        unknown
      >
    | undefined;
  allResults: SearchResult[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMoreRef: (node?: Element | null | undefined) => void;
  totalResults: number;
  searchError: string | null;
  searchTrigger: string;
  isTypingNewQuery: boolean;
};

export function SearchResultsContainer({
  query,
  status,
  data,
  allResults,
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
  totalResults,
  searchError,
  searchTrigger,
  isTypingNewQuery,
}: SearchResultsContainerProps) {
  // Don't show any search results if there's an error with the input
  if (searchError) {
    return null;
  }

  // Show empty state if no search has been triggered yet or user is typing a new query
  if (!searchTrigger || isTypingNewQuery) {
    return null;
  }

  // Don't show anything for empty or single character queries
  if (query.length === 1) {
    return null;
  }

  // Don't show loading state for non-Arabic text
  if (!isArabicText(query)) {
    return null;
  }

  if (status === 'pending' && !data && searchTrigger.length > 1) {
    return <LoadingState />;
  }

  if (status === 'error') {
    return <ErrorState />;
  }

  if (allResults.length === 0) {
    return <NoResults query={query} />;
  }

  return (
    <SearchResultsList
      allResults={allResults}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      loadMoreRef={loadMoreRef}
      totalResults={totalResults}
      query={query}
    />
  );
}
