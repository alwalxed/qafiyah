'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { searchPoems } from '@/lib/api/queries';
import type { PoemsSearchResult } from '@/lib/api/types';
import { isArabicText } from '@/utils/texts/is-arabic-text';
import { sanitizeArabicText } from '@/utils/texts/sanitize-arabic-text';

export type SearchResult = PoemsSearchResult & {
  _pageIndex: number;
  _resultIndex: number;
};

export function usePoemSearch() {
  // Use URL search params instead of state
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get values from URL
  const queryFromUrl = searchParams.get('q') || '';
  const exactFromUrl = searchParams.get('match_type') === 'exact';

  // Local state for form input and validation
  const [inputValue, setInputValue] = useState<string>(queryFromUrl);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isTypingNewQuery, setIsTypingNewQuery] = useState<boolean>(false);
  const lastSubmittedQueryRef = useRef<string>(queryFromUrl);
  const { ref: loadMoreRef, inView } = useInView();

  // Create a function to update URL params
  const updateSearchParams = useCallback(
    (params: {
      q?: string;
      match_type?: string;
      page?: string;
      meter_ids?: string;
      era_ids?: string;
      theme_ids?: string;
    }) => {
      const newParams = new URLSearchParams(searchParams.toString());

      // Update or remove parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      // Update the URL without refreshing the page
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Use React Query with URL parameters
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['search-poems', queryFromUrl, exactFromUrl],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      searchPoems(
        queryFromUrl,
        pageParam.toString(),
        exactFromUrl ? 'exact' : 'all',
        searchParams.get('meter_ids') || undefined,
        searchParams.get('era_ids') || undefined,
        searchParams.get('theme_ids') || undefined
      ),
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination?.hasNextPage
        ? Number(lastPage.data.pagination.currentPage) + 1
        : undefined,
    enabled: queryFromUrl.length > 1 && isArabicText(queryFromUrl),
    staleTime: 1000 * 60 * 60,
    initialPageParam: 1,
  });

  // Load more results when scrolling to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Check if user is typing a new query different from the URL
  useEffect(() => {
    if (queryFromUrl && inputValue !== queryFromUrl) {
      setIsTypingNewQuery(true);
    } else {
      setIsTypingNewQuery(false);
    }
  }, [inputValue, queryFromUrl]);

  // Process search results
  const allResults: SearchResult[] =
    data?.pages.flatMap((page, pageIndex) =>
      page.data.results.map((result, resultIndex) => ({
        ...result,
        _pageIndex: pageIndex,
        _resultIndex: resultIndex,
      }))
    ) || [];

  const totalResults = data?.pages[0]?.data.pagination.totalResults || 0;

  // Handle search form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setSearchError('الرجاء إدخال نص للبحث');
      return;
    }

    if (inputValue.trim().length === 1) {
      setSearchError('الرجاء إدخال كلمتين أو أكثر للبحث');
      return;
    }

    if (!isArabicText(inputValue)) {
      setSearchError('الرجاء إدخال نص باللغة العربية فقط');
      return;
    }

    // If validation passes
    setSearchError(null);
    const sanitizedQuery = sanitizeArabicText(inputValue.trim().slice(0, 50));
    setInputValue(sanitizedQuery); // Sanitize when submitting

    // Update URL with new query
    updateSearchParams({
      q: sanitizedQuery,
      page: '1', // Reset to first page on new search
    });

    setIsTypingNewQuery(false);
    lastSubmittedQueryRef.current = sanitizedQuery;
  };

  // Clear search
  const handleSearchClearClick = () => {
    setInputValue('');
    setSearchError(null);
    setIsTypingNewQuery(false);
    lastSubmittedQueryRef.current = '';

    // Clear URL parameters
    updateSearchParams({
      q: '',
      match_type: '',
      page: '',
      meter_ids: '',
      era_ids: '',
      theme_ids: '',
    });
  };

  // Toggle exact search
  const toggleExactSearch = (value: boolean) => {
    updateSearchParams({
      match_type: value ? 'exact' : 'all',
    });
  };

  // Reset search results when typing a new query
  const resetSearchResults = useCallback(() => {
    if (queryFromUrl && inputValue !== queryFromUrl) {
      setIsTypingNewQuery(true);
    }
  }, [queryFromUrl, inputValue]);

  // Validate search input
  useEffect(() => {
    if (inputValue && !isArabicText(inputValue)) {
      setSearchError('الرجاء إدخال نص باللغة العربية فقط');
    } else if (inputValue && inputValue.trim().length === 1) {
      setSearchError('الرجاء إدخال حرفين فأكثر');
    } else if (inputValue && inputValue.trim().length > 50) {
      setSearchError('الرجاء إدخال نص لا يتجاوز ٥٠ حرفاً');
    } else {
      setSearchError(null);
    }

    // If user is typing a new query (different from previous), reset results
    if (inputValue !== lastSubmittedQueryRef.current) {
      resetSearchResults();
    }
  }, [resetSearchResults, inputValue]);

  // Initialize input value from URL when component mounts or URL changes
  useEffect(() => {
    if (queryFromUrl && inputValue !== queryFromUrl) {
      setInputValue(queryFromUrl);
    }
  }, [queryFromUrl]);

  return {
    // Search state
    searchQuery: inputValue,
    setSearchQuery: setInputValue,
    searchError,
    setSearchError,
    searchTrigger: queryFromUrl, // For compatibility with existing code
    isTypingNewQuery,
    exactSearch: exactFromUrl,
    setExactSearch: toggleExactSearch,

    // Search results
    status,
    data,
    allResults,
    totalResults,
    hasNextPage,
    isFetchingNextPage,

    // Actions
    handleSubmit,
    handleSearchClearClick,
    resetSearchResults,
    loadMoreRef,
  };
}
