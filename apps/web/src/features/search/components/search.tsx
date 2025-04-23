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
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6 font-sans" dir="rtl">
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <SearchIcon className="h-5 w-5" />
            {text.currentHeaderTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Add error display after the input field in the UI */}
              {/* Find the div with className="relative flex-1" and add the error message after it */}
              <div className="relative flex-1">
                <Input
                  value={inputValue}
                  onChange={handleCustomInputChange}
                  onKeyDown={handleCustomKeyDown}
                  placeholder={text.currentInputPlaceholder}
                  className={`pr-4 text-right ${validationError && hasSubmitted ? 'border-red-500' : ''}`}
                />
                {validationError && hasSubmitted && (
                  <p className="text-red-500 text-sm mt-1">{validationError}</p>
                )}
              </div>
              <Button
                onClick={handleCustomSearch}
                disabled={isLoading || !inputValue.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
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
                className="text-sm flex items-center gap-1 px-2 py-1"
              >
                <Filter className="h-4 w-4" />
                {text.currentFilterButton}
                {filtersVisible ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              <div className="flex flex-wrap gap-1 justify-end">
                {selectedEras.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {text.badgeErasCount}
                  </Badge>
                )}
                {selectedMeters.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {text.badgeMetersCount}
                  </Badge>
                )}
                {selectedThemes.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {text.badgeThemesCount}
                  </Badge>
                )}
                {selectedRhymes.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {text.badgeRhymesCount}
                  </Badge>
                )}
              </div>
            </div>

            {filtersVisible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2 p-4 bg-slate-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">{text.searchTypeLabel}</label>
                  <Select
                    options={searchTypeOptions}
                    value={searchParams.search_type}
                    onChange={handleCustomSearchTypeChange}
                    placeholder={text.searchTypePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{text.matchTypeLabel}</label>
                  <Select
                    options={matchTypeOptions}
                    value={searchParams.match_type}
                    onChange={handleMatchTypeChange}
                    placeholder={text.searchTypePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{text.erasLabel}</label>
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
                      <label className="block text-sm font-medium mb-1">{text.metersLabel}</label>
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
                      <label className="block text-sm font-medium mb-1">{text.themesLabel}</label>
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
                      <label className="block text-sm font-medium mb-1">{text.rhymesLabel}</label>
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
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-red-700">{text.errorMessage}</CardContent>
        </Card>
      )}

      {inputValue && !isLoading && data.length === 0 && isSuccess && (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-8 text-slate-500">
            <SearchIcon className="h-12 w-12 mb-4 text-slate-300" />
            <p className="text-lg">{text.noResultsFound}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && !isFetchingNextPage ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {text.resultsCount}
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
            <div ref={loadMoreRef} className="h-10 flex justify-center">
              {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PoemCard({
  item: {
    poem_meter,
    poem_slug,
    poem_snippet,
    poem_title,
    poet_era,
    poet_name,
    poet_slug,
    relevance,
  },
}: {
  item: PoemsSearchResult;
}) {
  return (
    <Card className="group overflow-hidden border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-300">
      <a href={`${SITE_URL}/poems/${poem_slug}`} className="block">
        <CardContent className="p-5">
          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                {poem_title}
              </h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">بواسطة:</span>
                  <span
                    className="text-base font-medium text-gray-800 hover:text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `${SITE_URL}/poets/${poet_slug}`;
                    }}
                  >
                    {poet_name || 'شاعر'}
                  </span>
                </div>

                {poet_era && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {poet_era || 'عصر غير معروف'}
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-gray-700 text-base leading-relaxed line-clamp-3">{poem_snippet}</p>

            <div className="flex justify-between items-center pt-2">
              {poem_meter && (
                <Badge variant="secondary" className="text-xs">
                  بحر: {poem_meter}
                </Badge>
              )}

              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                {toArabicDigits(relevance || 0, {
                  handleScientificNotation: true,
                  fallbackToOriginal: true,
                })}
              </Badge>
            </div>
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
    <Card className="group overflow-hidden border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-300">
      <a href={`${SITE_URL}/poets/${poet_slug}/page/1`} className="block">
        <CardContent className="p-5">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                {poet_name || 'شاعر'}
              </h2>

              {poet_era && (
                <Badge variant="outline" className="text-xs font-normal">
                  {poet_era || 'عصر غير معروف'}
                </Badge>
              )}
            </div>

            {poet_bio && (
              <p className="text-gray-700 text-base leading-relaxed line-clamp-3">{poet_bio}</p>
            )}

            <div className="flex justify-end pt-1">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                {toArabicDigits(relevance || 0)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </a>
    </Card>
  );
}
