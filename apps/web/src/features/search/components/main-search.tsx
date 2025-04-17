'use client';

import { useLayoutStore } from '@/store/layout-store';
import { usePoemSearch } from '../hooks/use-poem-search';
import { SearchForm } from './search-form';
import { SearchHeader } from './search-header';
import { SearchResultsContainer } from './search-results-container';

export function SearchClientPage() {
  const {
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
  } = usePoemSearch();

  const { remainingHeight } = useLayoutStore();

  const minHeight = remainingHeight === 0 ? '85svh' : `${remainingHeight}px`;
  return (
    <div
      className="w-full flex justify-center items-center py-14 xs:py-20 lg:py-28"
      style={{ minHeight }}
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
            loadMoreRef={loadMoreRef}
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
