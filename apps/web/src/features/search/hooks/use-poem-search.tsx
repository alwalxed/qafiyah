'use client';

import type React from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { searchPoems } from '@/lib/api/queries';
import { isArabicText } from '@/utils/is-arabic-text';
import { sanitizeArabicText } from '@/utils/sanitize-arabic-text';

export interface SearchResult {
  _pageIndex: number;
  _resultIndex: number;
  id: number | null;
  title: string;
  slug: string;
  content_snippet: string;
  poet_name: string;
  poet_slug: string | null;
  meter_name: string | null;
  era_name: string | null;
}

export function usePoemSearch() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchTrigger, setSearchTrigger] = useState<string>('');
  const [isTypingNewQuery, setIsTypingNewQuery] = useState<boolean>(false);
  const [exactSearch, setExactSearch] = useState<boolean>(false);
  const lastSubmittedQueryRef = useRef<string>('');
  const { ref: loadMoreRef, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['search-poems', searchTrigger, exactSearch],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      searchPoems(searchTrigger, pageParam.toString(), exactSearch ? 'true' : 'false'),
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination?.hasNextPage
        ? Number(lastPage.data.pagination.currentPage) + 1
        : undefined,
    enabled: searchTrigger.length > 1 && isArabicText(searchTrigger),
    staleTime: 1000 * 60 * 60,
    initialPageParam: 1,
  });

  // Load more results when scrolling to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Check if user is typing a new query different from the last submitted one
  useEffect(() => {
    if (searchTrigger && searchQuery !== searchTrigger) {
      setIsTypingNewQuery(true);
    } else {
      setIsTypingNewQuery(false);
    }
  }, [searchQuery, searchTrigger]);

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

    if (!searchQuery.trim()) {
      setSearchError('الرجاء إدخال نص للبحث');
      return;
    }

    if (searchQuery.trim().length === 1) {
      setSearchError('الرجاء إدخال كلمتين أو أكثر للبحث');
      return;
    }

    if (!isArabicText(searchQuery)) {
      setSearchError('الرجاء إدخال نص باللغة العربية فقط');
      return;
    }

    // If validation passes
    setSearchError(null);
    const sanitizedQuery = sanitizeArabicText(searchQuery.trim().slice(0, 50));
    setSearchQuery(sanitizedQuery); // Sanitize when submitting
    setSearchTrigger(sanitizedQuery); // Only trigger search on submit
    setIsTypingNewQuery(false);
    lastSubmittedQueryRef.current = sanitizedQuery;
  };

  // Clear search
  const handleSearchClearClick = () => {
    setSearchQuery('');
    setSearchTrigger('');
    setSearchError(null);
    setIsTypingNewQuery(false);
    setExactSearch(false); // Reset exact search when clearing
    lastSubmittedQueryRef.current = '';
  };

  // Reset search results when typing a new query
  const resetSearchResults = useCallback(() => {
    if (searchTrigger && searchQuery !== searchTrigger) {
      setIsTypingNewQuery(true);
    }
  }, [searchTrigger, searchQuery]);

  // Validate search input
  useEffect(() => {
    if (searchQuery && !isArabicText(searchQuery)) {
      setSearchError('الرجاء إدخال نص باللغة العربية فقط');
    } else if (searchQuery && searchQuery.trim().length === 1) {
      setSearchError('الرجاء إدخال حرفين فأكثر');
    } else if (searchQuery && searchQuery.trim().length > 50) {
      setSearchError('الرجاء إدخال نص لا يتجاوز ٥٠ حرفاً');
    } else {
      setSearchError(null);
    }

    // If user is typing a new query (different from previous), reset results
    if (searchQuery !== lastSubmittedQueryRef.current) {
      resetSearchResults();
    }

    // Reset exactSearch when text is cleared
    if (!searchQuery) {
      setExactSearch(false);
    }
  }, [resetSearchResults, searchQuery]);

  return {
    // Search state
    searchQuery,
    setSearchQuery,
    searchError,
    setSearchError,
    searchTrigger,
    isTypingNewQuery,
    exactSearch,
    setExactSearch,

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
