'use client';

import type React from 'react';

import { cn } from '@/utils/conversions/cn';
import { CircleCheck, Eraser, Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

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

export function SearchForm({
  searchQuery,
  setSearchQuery,
  handleSubmit,
  handleSearchClearClick,
  searchError,
  resetSearchResults,
  exactSearch,
  setExactSearch,
}: SearchFormProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const previousQueryRef = useRef<string>(searchQuery);

  useEffect(() => {
    if (searchQuery !== previousQueryRef.current) {
      resetSearchResults();
      previousQueryRef.current = searchQuery;
    }
  }, [searchQuery, resetSearchResults]);

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
            placeholder="ابحث عن بيت أو جزء من بيت"
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
}
