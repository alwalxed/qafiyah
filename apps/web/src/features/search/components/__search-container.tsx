'use client';

import { LoadingDynamic } from '@/app/loading-dynamic';
import { Card } from '@/components/shadcn/card';
import dynamic from 'next/dynamic';
import {
  erasOptions,
  matchTypeOptions,
  metersOptions,
  rhymesOptions,
  searchTypeOptions,
  themesOptions,
} from '../constants';
import { useSearch } from '../hooks/use-search';
import { FilterBadges } from './filters-badges';
import { FiltersButton } from './filters-button';
import { SearchInput } from './search-input';

const Filters = dynamic(() => import('./filters').then((mod) => ({ default: mod.Filters })), {
  ssr: false,
  loading: () => <LoadingDynamic />,
});

const ResultList = dynamic(
  () => import('./result-list').then((mod) => ({ default: mod.ResultList })),
  {
    ssr: false,
    loading: () => <LoadingDynamic />,
  }
);

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
    handleTypingEffect,
  } = useSearch();

  return (
    <section className="w-full mx-auto max-w-2xl flex flex-col h-full flex-1 justify-start items pb-24">
      {/*  */}
      <div className="h-[25svh] w-full"></div>

      <div className="w-full flex flex-col gap-10 md:gap-16" dir="rtl">
        <h1 className="font-bold text-center justify-center items-center text-2xl xxs:text-3xl xs:text-4xl md:text-5xl text-zinc-800 flex py-2">
          {text.currentHeaderTitle}
        </h1>
        <Card className="border-0 shadow-none bg-transparent">
          <div className="p-0 bg">
            <div className="flex flex-col gap-4">
              <SearchInput
                effectText={text.currentInputPlaceholder}
                handleTypingEffect={handleTypingEffect}
                hasSubmitted={hasSubmitted}
                isLoading={isLoading}
                searchLabel={text.search}
                inputValue={inputValue}
                validationError={validationError}
                handleCustomKeyDown={handleCustomKeyDown}
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
                  handleCustomSearch={handleCustomSearch}
                  inputValue={inputValue}
                  isLoading={isLoading}
                  searchLabel={text.search}
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
    </section>
  );
}
