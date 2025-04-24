'use client';

import { Card } from '@/components/shadcn/card';
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
import { ResultList } from './result-list';
import { SearchInput } from './search-input';

export function SearchContainer() {
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
    <div className="w-full max-w-2xl mx-auto flex flex-col my-32 gap-10 md:gap-16" dir="rtl">
      <h1 className="font-bold text-center justify-center items-center text-2xl xxs:text-3xl xs:text-4xl md:text-5xl text-zinc-800 flex py-2">
        {text.currentHeaderTitle}
      </h1>
      <Card className="border-0 shadow-none bg-transparent">
        <div className="p-0 bg">
          <div className="flex flex-col gap-4">
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
              <FiltersButton toggleFilters={toggleFilters} filtersVisible={filtersVisible} />

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

      <ResultList
        data={data}
        loadMoreRef={loadMoreRef}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        isSuccess={isSuccess}
        inputValue={inputValue}
        searchType={searchType}
        errorMessageText={text.errorMessage}
        refreshThePageText={text.refreshThePage}
        noResultsFoundText={text.noResultsFound}
        resultTextText={text.resultText}
      />
    </div>
  );
}
