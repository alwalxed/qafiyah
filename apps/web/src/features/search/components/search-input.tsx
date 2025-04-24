'use client';

import { Input } from '@/components/shadcn/input';
import { CircleX, Loader2, SearchIcon } from 'lucide-react';
import type { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler } from 'react';

type Props = {
  hasSubmitted: boolean;
  isLoading: boolean;

  inputValue: string;
  currentInputPlaceholderText: string;
  validationError: string | null;
  searchLabel: string;

  handleCustomSearch: MouseEventHandler<HTMLButtonElement>;
  handleCustomKeyDown: KeyboardEventHandler<HTMLInputElement>;
  handleCustomInputChange: ChangeEventHandler<HTMLInputElement>;
  resetAllStates: () => void;
};

export function SearchInput({
  hasSubmitted,
  isLoading,

  inputValue,
  currentInputPlaceholderText,
  validationError,
  searchLabel,

  handleCustomSearch,
  handleCustomKeyDown,
  handleCustomInputChange,
  resetAllStates,
}: Props) {
  return (
    <div className="w-full">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleCustomInputChange}
          onKeyDown={handleCustomKeyDown}
          placeholder={currentInputPlaceholderText}
          className={`pl-10 text-right border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400 ${
            validationError && hasSubmitted ? 'border-red-300' : ''
          }`}
          dir="rtl"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {inputValue.trim() && !isLoading && (
            <button
              onClick={resetAllStates}
              className="text-zinc-400 hover:text-zinc-700 focus:outline-none"
              aria-label="Clear search"
            >
              <CircleX className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleCustomSearch}
            disabled={isLoading || !inputValue.trim()}
            className="text-zinc-500 hover:text-zinc-800 disabled:opacity-50 disabled:pointer-events-none"
            aria-label={searchLabel}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SearchIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      {validationError && hasSubmitted && (
        <p className="text-red-500 text-xs mt-1 text-right">{validationError}</p>
      )}
    </div>
  );
}
