'use client';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { Select } from '@/components/ui/select';
import { CheckboxSelect } from '@/components/ui/select-multi';
import { SITE_URL } from '@/constants/GLOBALS';
import type { PoemsSearchResult, PoetsSearchResult } from '@/lib/api/types';
import { ChevronDown, ChevronUp, Filter, Loader2, SearchIcon } from 'lucide-react';
import { toArabicDigits } from 'to-arabic-digits';
import {
  erasOptions,
  matchTypeOptions,
  metersOptions,
  rhymesOptions,
  searchTypeOptions,
  themesOptions,
} from '../constants';
import { useSearch } from '../hooks/use-search';
import { HighlightedText } from './highlighted-text';

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
  } = useSearch();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-5 font-sans" dir="rtl">
      <Card className="border-zinc-100 shadow-sm bg-white">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xl font-medium text-zinc-800 flex items-center gap-2">
            <SearchIcon className="h-4 w-4 text-zinc-500" />
            {text.currentHeaderTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Input
                  value={inputValue}
                  onChange={handleCustomInputChange}
                  onKeyDown={handleCustomKeyDown}
                  placeholder={text.currentInputPlaceholder}
                  className={`pr-4 text-right border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400 ${
                    validationError && hasSubmitted ? 'border-red-300' : ''
                  }`}
                />
                {validationError && hasSubmitted && (
                  <p className="text-red-500 text-xs mt-1">{validationError}</p>
                )}
              </div>
              <Button
                onClick={handleCustomSearch}
                disabled={isLoading || !inputValue.trim()}
                className="bg-zinc-800 hover:bg-zinc-900 text-white"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <SearchIcon className="h-4 w-4 mr-2" />
                )}
                {text.search}
              </Button>
            </div>

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
          {data.length > 0 && <p className="text-sm text-zinc-500 px-1">{text.resultsCount}</p>}

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

export function PoemCard({
  item: { poem_meter, poem_slug, poem_snippet, poem_title, poet_era, poet_name, poet_slug },
}: {
  item: PoemsSearchResult;
}) {
  return (
    <Card className="group overflow-hidden border-zinc-100 hover:border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <a href={`${SITE_URL}/poems/${poem_slug}`} className="block">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-lg font-medium text-zinc-800 group-hover:text-zinc-900 transition-colors">
                {poem_title}
              </h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `${SITE_URL}/poets/${poet_slug}`;
                    }}
                  >
                    {poet_name || 'شاعر'}
                  </span>
                </div>

                <div className="flex justify-center items-center gap-2">
                  {poem_meter && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-200"
                    >
                      {poem_meter.split(' ')[0]}
                    </Badge>
                  )}
                  {poet_era && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-200"
                    >
                      {poet_era.split(' ')[0] || 'عصر غير معروف'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <HighlightedText
              className="text-zinc-600 text-sm leading-relaxed line-clamp-2"
              text={poem_snippet}
            />
          </div>
        </CardContent>
      </a>
    </Card>
  );
}

export function PoetCard({
  item: { poet_bio, poet_era, poet_name, poet_slug, relevance },
}: {
  item: PoetsSearchResult;
}) {
  return (
    <Card className="group overflow-hidden border-zinc-100 hover:border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <a href={`${SITE_URL}/poets/${poet_slug}/page/1`} className="block">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-zinc-800 group-hover:text-zinc-900 transition-colors">
                {poet_name || 'شاعر'}
              </h2>

              {poet_era && (
                <Badge
                  variant="outline"
                  className="text-xs font-normal text-zinc-600 border-zinc-200 bg-zinc-50"
                >
                  {poet_era || 'عصر غير معروف'}
                </Badge>
              )}
            </div>

            {poet_bio && (
              <p className="text-zinc-600 text-sm leading-relaxed line-clamp-2">{poet_bio}</p>
            )}

            <div className="flex justify-end pt-1">
              <Badge className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-0">
                {toArabicDigits(relevance || 0)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </a>
    </Card>
  );
}
