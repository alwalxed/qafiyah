'use client';

import { Card, CardContent } from '@/components/shadcn/card';
import type { PoemsSearchResult, PoetsSearchResult } from '@/lib/api/types';
import { Loader2, SearchIcon } from 'lucide-react';
import {
  erasOptions,
  matchTypeOptions,
  metersOptions,
  rhymesOptions,
  searchTypeOptions,
  themesOptions,
} from '../constants';
import { useSearch } from '../hooks/use-search';
import { Filters } from './filters';
import { FilterBadges } from './filters-badges';
import { FiltersButton } from './filters-button';
import { PoemCard, PoetCard } from './result-cards';
import { SearchInput } from './search-input';

export function Search() {
  const {
    text,

    isLoading,
    isError,
    isSuccess,
    isFetchingNextPage,
    hasSubmitted,
    filtersVisible,
    loadMoreRef,
    data,
    validationError,
    inputValue,
    searchParams,
    searchType,
    selectedMeters,
    selectedThemes,
    selectedEras,
    selectedRhymes,
    handleMatchTypeChange,
    handleRhymesChange,
    handleErasChange,
    handleMetersChange,
    handleThemesChange,
    handleCustomInputChange,
    handleCustomKeyDown,
    handleCustomSearch,
    toggleFilters,
    handleCustomSearchTypeChange,
    resetAllStates,
  } = useSearch();

  return (
    <div className="w-full max-w-4xl mx-auto my-48 flex flex-col gap-4" dir="rtl">
      <h1 className="font-bold text-center justify-center items-center text-5xl text-zinc-800 flex py-2">
        {text.currentHeaderTitle}
      </h1>
      <Card className="border-0 shadow-none">
        <div className="p-0 bg">
          <div className="flex flex-col gap-3">
            <SearchInput
              hasSubmitted={hasSubmitted}
              isLoading={isLoading}
              currentInputPlaceholderText={text.currentInputPlaceholder}
              searchLabel={text.search}
              inputValue={inputValue}
              validationError={validationError}
              handleCustomKeyDown={handleCustomKeyDown}
              handleCustomSearch={handleCustomSearch}
              handleCustomInputChange={handleCustomInputChange}
              resetAllStates={resetAllStates}
            />
            <div className="flex items-center justify-between">
              <FiltersButton
                toggleFilters={toggleFilters}
                filtersVisible={filtersVisible}
                currentFiltersButtonText={text.currentFiltersButton}
              />

              <FilterBadges
                selectedErasLength={selectedEras.length}
                selectedMetersLength={selectedMeters.length}
                selectedRhymesLength={selectedRhymes.length}
                selectedThemesLength={selectedThemes.length}
                badgeErasCountText={text.badgeErasCount}
                badgeMetersCountText={text.badgeMetersCount}
                badgeThemesCountText={text.badgeThemesCount}
                badgeRhymesCountText={text.badgeRhymesCount}
              />
            </div>

            {filtersVisible && (
              <Filters
                searchType={searchType}
                searchTypeLabelText={text.searchTypeLabel}
                searchTypeOptions={searchTypeOptions}
                searchParamsSearchType={searchParams.search_type}
                handleCustomSearchTypeChange={handleCustomSearchTypeChange}
                searchTypePlaceholderText={text.searchTypePlaceholder}
                matchTypeLabelText={text.matchTypeLabel}
                matchTypeOptions={matchTypeOptions}
                searchParamsMatchType={searchParams.match_type}
                handleMatchTypeChange={handleMatchTypeChange}
                erasLabelText={text.erasLabel}
                erasOptions={erasOptions}
                selectedEras={selectedEras}
                erasPlaceholderNounFormsText={text.erasPlaceholderNounForms}
                handleErasChange={handleErasChange}
                erasPlaceholderText={text.erasPlaceholder}
                metersLabelText={text.metersLabel}
                metersOptions={metersOptions}
                selectedMeters={selectedMeters}
                metersPlaceholderNounFormsText={text.metersPlaceholderNounForms}
                handleMetersChange={handleMetersChange}
                metersPlaceholderText={text.metersPlaceholder}
                themesLabelText={text.themesLabel}
                themesOptions={themesOptions}
                selectedThemes={selectedThemes}
                themesPlaceholderNounFormsText={text.themesPlaceholderNounForms}
                handleThemesChange={handleThemesChange}
                themesPlaceholderText={text.themesPlaceholder}
                rhymesLabelText={text.rhymesLabel}
                rhymesOptions={rhymesOptions}
                selectedRhymes={selectedRhymes}
                rhymesPlaceholderNounFormsText={text.rhymesPlaceholderNounForms}
                handleRhymesChange={handleRhymesChange}
                rhymesPlaceholderText={text.rhymesPlaceholder}
              />
            )}
          </div>
        </div>
      </Card>

      {isError && (
        <Card className="border-red-100 bg-red-50 shadow-none">
          <CardContent className="p-3 text-red-600 text-sm">{text.errorMessage}</CardContent>
        </Card>
      )}

      {inputValue && !isLoading && data.length === 0 && isSuccess && (
        <Card className="border-zinc-100 shadow-sm bg-white">
          <CardContent className="flex flex-col items-center justify-center p-8 text-zinc-400">
            <SearchIcon className="h-10 w-10 mb-3 text-zinc-200" />
            <p className="text-base">{text.noResultsFound}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && !isFetchingNextPage ? (
        <div className="flex justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      ) : (
        <div className="space-y-3">
          {data.length > 0 && <p className="text-sm text-zinc-500 px-1">{text.resultText}</p>}

          {searchType === 'poems' &&
            (data as PoemsSearchResult[]).map((item, index) => (
              <PoemCard
                key={`slug-${item.poem_slug}-relevance-${item.relevance}-index-${index}`}
                item={item}
              />
            ))}

          {searchType === 'poets' &&
            (data as PoetsSearchResult[]).map((item, index) => (
              <PoetCard
                key={`slug-${item.poet_slug}-relevance-${item.relevance}-index-${index}`}
                item={item}
              />
            ))}

          {/* Loading indicator for next page */}
          {data.length > 0 && (
            <div ref={loadMoreRef} className="h-8 flex justify-center">
              {isFetchingNextPage && <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
