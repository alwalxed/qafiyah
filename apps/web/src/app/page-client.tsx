'use client';

import type React from 'react';

import { NAV_LINKS } from '@/constants/links';
import { searchPoems } from '@/lib/api/queries';
import type { PaginationMeta, SearchResponseData } from '@/lib/api/types';
import { cn, removeTashkeel, toArabicDigits } from '@/lib/utils';
import { useLayoutStore } from '@/store/layout-store';
import { cleanSearchResponseText } from '@/utils/clean-search-response-text';
import { isArabicText } from '@/utils/is-arabic-text';
import { sanitizeArabicText } from '@/utils/sanitize-arabic-text';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { CircleCheck, Eraser, Loader2, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const SearchHeader = () => {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-2">ابحث في مليون بيت</h1>
    </div>
  );
};

type SearchFormProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleSearchClearClick: () => void;
  searchError: string | null;
  setSearchError: (error: string | null) => void;
  resetSearchResults: () => void;
  exactSearch: boolean;
  setExactSearch: (exact: boolean) => void;
};

// Update the SearchForm component to show the Equal icon only when there's text
// and to reset exactSearch when text is cleared
const SearchForm = ({
  searchQuery,
  setSearchQuery,
  handleSubmit,
  handleSearchClearClick,
  searchError,
  setSearchError,
  resetSearchResults,
  exactSearch,
  setExactSearch,
}: SearchFormProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const previousQueryRef = useRef<string>(searchQuery);

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
    if (searchQuery !== previousQueryRef.current) {
      resetSearchResults();
      previousQueryRef.current = searchQuery;
    }

    // Reset exactSearch when text is cleared
    if (!searchQuery) {
      setExactSearch(false);
    }
  }, [searchQuery, setSearchError, resetSearchResults, setExactSearch]);

  // Custom function to handle clearing the search
  const handleClear = () => {
    handleSearchClearClick();
    setExactSearch(false); // Reset exact search when clearing
  };

  return (
    <div className="mb-10">
      <div className="relative w-full max-w-2xl mx-auto">
        <form ref={formRef} onSubmit={handleSubmit} className="w-full" dir="rtl">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-zinc-400 z-10">
            <Search className="size-5" />
          </div>

          <input
            ref={searchInputRef}
            type="search"
            placeholder="ابحث عن قصيدة أو شاعر أو بيت"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxLength={50}
            className={`w-full pr-12 pl-12 py-4 text-lg bg-white border ${
              searchError
                ? 'border-red-300 focus:ring-red-500'
                : 'border-zinc-200 focus:ring-zinc-500'
            } rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-zinc-400 transition-all duration-200 [&::-webkit-search-cancel-button]:appearance-none`}
            dir="rtl"
          />

          {/* Show Equal icon for exact search only when there's text */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setExactSearch(!exactSearch)}
              className={`absolute inset-y-0 left-12 flex items-center pl-2 transition-colors duration-200 z-10 ${
                exactSearch ? 'text-blue-600' : 'text-zinc-400 hover:text-zinc-700'
              }`}
              aria-label={exactSearch ? 'بحث تقريبي' : 'بحث مطابق'}
              title={exactSearch ? 'بحث مطابق (مفعّل)' : 'بحث مطابق'}
            >
              <CircleCheck className="size-5" />
            </button>
          )}

          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 hover:text-zinc-700 transition-colors duration-200 z-10"
              aria-label="مسح البحث"
            >
              <Eraser className="size-5" />
            </button>
          )}
        </form>

        {searchError && (
          <div
            className={cn('mt-2 text-right text-red-500 text-sm absolute w-full', {
              'text-left': exactSearch,
            })}
            dir="rtl"
          >
            {searchError}
          </div>
        )}

        {/* Add a small indicator for exact search mode */}
        {exactSearch && searchQuery && (
          <div className="mt-2 text-right text-xs text-blue-600 absolute right-0" dir="rtl">
            <span className="bg-blue-50 px-2 py-0.5 rounded-full">بحث مطابق</span>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptySearchState = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[40svh]">
      <div className="grid grid-cols-3 gap-4 w-full h-full">
        {NAV_LINKS.map(
          (link) =>
            link.external !== true && (
              <a
                key={link.href}
                href={link.href}
                className="bg-zinc-100/50 border border-zinc-300/40 rounded-md justify-center items-center flex"
              >
                {link.name}
              </a>
            )
        )}
      </div>
    </div>
  );
};

// Loading State Component
const LoadingState = () => {
  return (
    <div className="flex flex-col justify-center items-center p-16">
      <Loader2 className="animate-spin h-10 w-10 text-zinc-400 mb-4" />
      <p className="text-zinc-500">جار البحث...</p>
    </div>
  );
};

// Error State Component
const ErrorState = () => {
  return (
    <div className="p-6 text-center text-red-600 bg-red-50 rounded-xl border border-red-100 max-w-lg mx-auto">
      <p className="font-medium mb-1">حدث خطأ أثناء البحث</p>
      <p className="text-red-500 text-sm">يرجى المحاولة مرة أخرى لاحقاً</p>
    </div>
  );
};

// No Results Component
type NoResultsProps = {
  query: string;
};

const NoResults = ({ query }: NoResultsProps) => {
  return (
    <div className="p-8 text-center max-w-lg mx-auto">
      <X className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
      <h3 className="text-xl font-medium text-zinc-500 mb-2">لم نجد قصيدة</h3>
      <p className="text-zinc-500">{`لم نتمكن من العثور على نتائج لـ "${sanitizeArabicText(query).slice(0, 10)}..."`}</p>
    </div>
  );
};

// Search Results Header Component
type SearchResultsHeaderProps = {
  totalResults: number;
  query: string;
};

const SearchResultsHeader = ({ totalResults, query }: SearchResultsHeaderProps) => {
  return (
    <div className="text-right text-zinc-600 mb-4 px-2">
      <span className="bg-zinc-100 px-3 py-1 rounded-full text-sm font-medium">
        {`عثر على ${toArabicDigits(totalResults)} نتيجة لـ "${sanitizeArabicText(query)}"`}
      </span>
    </div>
  );
};

interface SearchResult {
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

type SearchResultItemProps = {
  result: SearchResult;
  searchQuery: string; // Add this prop
};

const SearchResultItem = ({ result, searchQuery }: SearchResultItemProps) => {
  const highlightMatches = (text: string, query: string) => {
    if (!query || query.length <= 1 || !text) return text;

    // Clean and prepare the query for highlighting
    const cleanQuery = removeTashkeel(sanitizeArabicText(query.trim()));

    // If no valid query to highlight, return original text
    if (!cleanQuery) return text;

    // Split query into words for individual matching
    const queryWords = cleanQuery.split(/\s+/).filter((word) => word.length > 1);

    if (queryWords.length === 0) return text;

    // Create a safe text for rendering with highlighted matches
    let highlightedText = text;

    // Replace each query word with a highlighted version
    queryWords.forEach((word) => {
      // Create a regex that matches the word with word boundaries
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="text-red-600">$1</span>');
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <a
      href={`/poems/${result.slug}`}
      key={`page-${result._pageIndex}-item-${result._resultIndex}-id-${result.id}`}
      className="block bg-white p-5 hover:bg-zinc-50 transition-colors rounded-xl border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 duration-200"
    >
      <div className="text-right">
        <h2 className="font-bold text-xl text-zinc-900 mb-2">
          {highlightMatches(result.title.replace(/"/g, ''), searchQuery)}
        </h2>
        <div className="flex justify-end items-center gap-2 text-sm mb-3">
          <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-700">
            {highlightMatches(result.poet_name, searchQuery)}
          </span>
          {result.meter_name && (
            <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-700">
              {result.meter_name}
            </span>
          )}
          {result.era_name && (
            <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-700">
              {result.era_name}
            </span>
          )}
        </div>
        <p className="text-zinc-700 line-clamp-3 text-right leading-relaxed" dir="rtl">
          {highlightMatches(
            removeTashkeel(cleanSearchResponseText(result.content_snippet.split('*').join(' — '))),
            searchQuery
          )}
        </p>
      </div>
    </a>
  );
};

// Load More Component
type LoadMoreProps = {
  isFetchingNextPage: boolean;
  loadMoreRef: (node?: Element | null | undefined) => void;
};

const LoadMore = ({ isFetchingNextPage, loadMoreRef }: LoadMoreProps) => {
  return (
    <div ref={loadMoreRef} className="p-8 flex justify-center items-center">
      {isFetchingNextPage ? (
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin h-8 w-8 text-zinc-400 mb-2" />
          <span className="text-zinc-500 text-sm">جار تحميل المزيد...</span>
        </div>
      ) : (
        <div className="text-zinc-400 text-sm bg-white px-4 py-2 rounded-full border border-zinc-200">
          اسحب لتحميل المزيد
        </div>
      )}
    </div>
  );
};

// Search Results List Component
type SearchResultsListProps = {
  allResults: SearchResult[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMoreRef: (node?: Element | null | undefined) => void;
  totalResults: number;
  query: string;
};

const SearchResultsList = ({
  allResults,
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
  totalResults,
  query,
}: SearchResultsListProps) => {
  return (
    <>
      <SearchResultsHeader totalResults={totalResults} query={query} />

      <div className="space-y-3">
        {allResults.map((result) => (
          <SearchResultItem
            key={`page-${result._pageIndex}-item-${result._resultIndex}-id-${result.id}`}
            result={result}
            searchQuery={query} // Pass the query as a prop
          />
        ))}

        {/* Loading more indicator */}
        {hasNextPage && (
          <LoadMore isFetchingNextPage={isFetchingNextPage} loadMoreRef={loadMoreRef} />
        )}
      </div>
    </>
  );
};

// Main Search Results Container Component
type SearchResultsContainerProps = {
  query: string;
  status: string;
  data:
    | InfiniteData<
        {
          data: SearchResponseData;
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

const SearchResultsContainer = ({
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
}: SearchResultsContainerProps) => {
  // Don't show any search results if there's an error with the input
  if (searchError) {
    return null;
  }

  // Show empty state if no search has been triggered yet or user is typing a new query
  if (!searchTrigger || isTypingNewQuery) {
    return <EmptySearchState />;
  }

  // Don't show anything for empty or single character queries
  if (query.length <= 1) {
    return <EmptySearchState />;
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
};

// Main Component
export function SearchClientPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { ref, inView } = useInView();
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchTrigger, setSearchTrigger] = useState<string>('');
  const [isTypingNewQuery, setIsTypingNewQuery] = useState<boolean>(false);
  const lastSubmittedQueryRef = useRef<string>('');
  const [exactSearch, setExactSearch] = useState<boolean>(false);

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

  const allResults =
    data?.pages.flatMap((page, pageIndex) =>
      page.data.results.map((result, resultIndex) => ({
        ...result,
        _pageIndex: pageIndex,
        _resultIndex: resultIndex,
      }))
    ) || [];

  const totalResults = data?.pages[0]?.data.pagination.totalResults || 0;

  // Update the handleSearchClearClick function in the main component to also reset exactSearch
  const handleSearchClearClick = () => {
    setSearchQuery('');
    setSearchTrigger('');
    setSearchError(null);
    setIsTypingNewQuery(false);
    setExactSearch(false); // Reset exact search when clearing
    lastSubmittedQueryRef.current = '';
  };

  const resetSearchResults = () => {
    if (searchTrigger && searchQuery !== searchTrigger) {
      setIsTypingNewQuery(true);
    }
  };

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

  const { remainingHeight } = useLayoutStore();
  return (
    <div
      className="w-full flex justify-center items-center min-h-[80svh]"
      style={{ minHeight: `${remainingHeight}px` }}
    >
      <div className="w-full md:max-w-2xl">
        {/* Header */}
        <SearchHeader />

        {/* Search Form */}
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSubmit={handleSubmit}
          handleSearchClearClick={handleSearchClearClick}
          searchError={searchError}
          setSearchError={setSearchError}
          resetSearchResults={resetSearchResults}
          exactSearch={exactSearch}
          setExactSearch={setExactSearch}
        />

        {/* Search results */}
        <div className="mt-6">
          <SearchResultsContainer
            query={searchQuery}
            status={status}
            data={data}
            allResults={allResults}
            hasNextPage={hasNextPage || false}
            isFetchingNextPage={isFetchingNextPage}
            loadMoreRef={ref}
            totalResults={totalResults}
            searchError={searchError}
            searchTrigger={searchTrigger}
            isTypingNewQuery={isTypingNewQuery}
          />
        </div>
      </div>
    </div>
  );
}
