'use client';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent } from '@/components/shadcn/card';
import { Select } from '@/components/ui/select';
import { CheckboxSelect } from '@/components/ui/select-multi';
import type { PoemsSearchResult, PoetsSearchResult } from '@/lib/api/types';
import { ChevronDown, ChevronUp, Filter, Loader2, SearchIcon } from 'lucide-react';
import {
  erasOptions,
  matchTypeOptions,
  metersOptions,
  rhymesOptions,
  searchTypeOptions,
  themesOptions,
} from '../constants';
import { useSearch } from '../hooks/use-search';
import { PoemCard, PoetCard } from './cards';
import { SearchInput } from './input';

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
    <div className="w-full max-w-4xl mx-auto p-4 my-48 flex flex-col gap-4" dir="rtl">
      <h1 className="font-bold text-center justify-center items-center text-5xl text-zinc-800 flex py-2">
        {text.currentHeaderTitle}
      </h1>
      <Card className="border-0 shadow-none">
        <CardContent className="p-4">
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
              <Button
                variant="ghost"
                onClick={toggleFilters}
                className="text-xs flex items-center gap-1 px-2 py-1 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              >
                <Filter className="h-3 w-3" />
                {text.currentFilterButton}
                {filtersVisible ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>

              <div className="flex flex-wrap gap-1 justify-end">
                {selectedEras.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-zinc-600 border-zinc-200 bg-zinc-50"
                  >
                    {text.badgeErasCount}
                  </Badge>
                )}
                {selectedMeters.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-zinc-600 border-zinc-200 bg-zinc-50"
                  >
                    {text.badgeMetersCount}
                  </Badge>
                )}
                {selectedThemes.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-zinc-600 border-zinc-200 bg-zinc-50"
                  >
                    {text.badgeThemesCount}
                  </Badge>
                )}
                {selectedRhymes.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-zinc-600 border-zinc-200 bg-zinc-50"
                  >
                    {text.badgeRhymesCount}
                  </Badge>
                )}
              </div>
            </div>

            {filtersVisible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2 p-3 bg-zinc-50 rounded-md border border-zinc-100">
                <div>
                  <label className="block text-xs font-medium mb-1 text-zinc-600">
                    {text.searchTypeLabel}
                  </label>
                  <Select
                    options={searchTypeOptions}
                    value={searchParams.search_type}
                    onChange={handleCustomSearchTypeChange}
                    placeholder={text.searchTypePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-zinc-600">
                    {text.matchTypeLabel}
                  </label>
                  <Select
                    options={matchTypeOptions}
                    value={searchParams.match_type}
                    onChange={handleMatchTypeChange}
                    placeholder={text.searchTypePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-zinc-600">
                    {text.erasLabel}
                  </label>
                  <CheckboxSelect
                    options={erasOptions}
                    value={selectedEras}
                    placeholderNounForms={text.erasPlaceholderNounForms}
                    onChange={handleErasChange}
                    placeholder={text.erasPlaceholder}
                    multiple={true}
                  />
                </div>

                {searchType === 'poems' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-600">
                        {text.metersLabel}
                      </label>
                      <CheckboxSelect
                        options={metersOptions}
                        value={selectedMeters}
                        placeholderNounForms={text.metersPlaceholderNounForms}
                        onChange={handleMetersChange}
                        placeholder={text.metersPlaceholder}
                        multiple={true}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-600">
                        {text.themesLabel}
                      </label>
                      <CheckboxSelect
                        options={themesOptions}
                        value={selectedThemes}
                        placeholderNounForms={text.themesPlaceholderNounForms}
                        onChange={handleThemesChange}
                        placeholder={text.themesPlaceholder}
                        multiple={true}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1 text-zinc-600">
                        {text.rhymesLabel}
                      </label>
                      <CheckboxSelect
                        options={rhymesOptions}
                        value={selectedRhymes}
                        placeholderNounForms={text.rhymesPlaceholderNounForms}
                        onChange={handleRhymesChange}
                        placeholder={text.rhymesPlaceholder}
                        multiple={true}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
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
