'use client';

import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
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

export function Search() {
  const {
    isLoading,
    isError,
    isSuccess,
    isFetchingNextPage,
    hasSubmitted,
    filtersVisible,

    loadMoreRef,

    data,
    error,
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

  const text = {
    currentHeaderTitle: searchType === 'poems' ? 'ابحث في مليون بيت' : 'ابحث عن ديوان شاعر',
    currentInputPlaceholder: searchType === 'poems' ? 'إن الذي سمك السماء بنى لنا' : 'المتنبي',
    currentFilterButton: filtersVisible ? 'إخفاء الفلاتر' : 'عرض الفلاتر',

    search: 'ابحث',
  };

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
                    العصور: {selectedEras.length}
                  </Badge>
                )}
                {selectedMeters.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    البحور: {selectedMeters.length}
                  </Badge>
                )}
                {selectedThemes.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    الأغراض: {selectedThemes.length}
                  </Badge>
                )}
              </div>
            </div>

            {filtersVisible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2 p-4 bg-slate-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">نوع البحث</label>
                  <Select
                    options={searchTypeOptions}
                    value={searchParams.search_type}
                    onChange={handleCustomSearchTypeChange}
                    placeholder="اختر نوع البحث"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">طريقة البحث</label>
                  <Select
                    options={matchTypeOptions}
                    value={searchParams.match_type}
                    onChange={handleMatchTypeChange}
                    placeholder="اختر طريقة البحث"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">العصور</label>
                  <CheckboxSelect
                    options={erasOptions}
                    value={selectedEras}
                    onChange={handleErasChange}
                    placeholder="اختر العصور"
                    multiple={true}
                  />
                </div>

                {searchType === 'poems' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">البحور</label>
                      <CheckboxSelect
                        options={metersOptions}
                        value={selectedMeters}
                        onChange={handleMetersChange}
                        placeholder="اختر البحور"
                        multiple={true}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">المواضيع</label>
                      <CheckboxSelect
                        options={themesOptions}
                        value={selectedThemes}
                        onChange={handleThemesChange}
                        placeholder="اختر المواضيع"
                        multiple={true}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">القوافي</label>
                      <CheckboxSelect
                        options={rhymesOptions}
                        value={selectedRhymes}
                        onChange={handleRhymesChange}
                        placeholder="اختر القافية"
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
          <CardContent className="p-4 text-red-700">
            خطأ: {(error as Error)?.message || 'حدث خطأ ما'}
          </CardContent>
        </Card>
      )}

      {inputValue && !isLoading && data.length === 0 && isSuccess && (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-8 text-slate-500">
            <SearchIcon className="h-12 w-12 mb-4 text-slate-300" />
            <p className="text-lg">{`لم يتم العثور على نتائج لـ "${searchParams.q}"`}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && !isFetchingNextPage ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {searchType === 'poems' &&
            (data as PoemsSearchResult[]).map((item, index) => (
              <Card
                key={`slug-${item.poem_slug}-relevance-${item.relevance}-index-${index}`}
                className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-semibold">{item.poet_name || 'شاعر'}</h2>
                      <Badge variant="outline" className="text-xs">
                        {item.poet_era || 'عصر غير معروف'}
                      </Badge>
                    </div>
                    <p className="text-slate-700 text-lg leading-relaxed">{item.poem_snippet}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.poem_meter && (
                        <Badge variant="secondary" className="text-xs">
                          بحر: {item.poem_meter}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

          {searchType === 'poets' &&
            (data as PoetsSearchResult[]).map((item, index) => (
              <Card
                key={`slug-${item.poet_slug}-relevance-${item.relevance}-index-${index}`}
                className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-semibold">{item.poet_name || 'شاعر'}</h2>
                      <Badge variant="outline" className="text-xs">
                        {item.poet_era || 'عصر غير معروف'}
                      </Badge>
                    </div>
                    {item.poet_bio && <p className="text-slate-700 mb-2">{item.poet_bio}</p>}
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="secondary" className="text-xs">
                        عدد القصائد: {item.total_count}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
