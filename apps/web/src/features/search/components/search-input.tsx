'use client';

import { Input } from '@/components/shadcn/input';
import { cn } from '@/lib/utils';
import { CircleX } from 'lucide-react';
import { type ChangeEventHandler, type KeyboardEventHandler } from 'react';

type Props = {
  hasSubmitted: boolean;

  inputValue: string;
  validationError: string | null;
  searchLabel: string;

  handleCustomKeyDown: KeyboardEventHandler<HTMLInputElement>;
  handleCustomInputChange: ChangeEventHandler<HTMLInputElement>;
  resetAllStates: () => void;
  hasActiveFiltersOrInput: boolean;

  effectText: string;
  handleTypingEffect: (show: boolean) => void;
};

export function SearchInput({
  hasSubmitted,

  inputValue,
  validationError,
  searchLabel,

  handleCustomKeyDown,
  handleCustomInputChange,
  resetAllStates,

  effectText,
  handleTypingEffect,
  hasActiveFiltersOrInput,
}: Props) {
  return (
    <div tabIndex={-1} className="w-full">
      <PreservedErrorSpace hasSubmitted={hasSubmitted} validationError={validationError} />
      <div tabIndex={-1} className="relative">
        <Input
          tabIndex={0}
          placeholder={effectText}
          onFocus={() => handleTypingEffect(false)}
          onBlur={() => handleTypingEffect(true)}
          maxLength={50}
          value={inputValue}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          autoSave="off"
          spellCheck={false}
          onChange={handleCustomInputChange}
          onKeyDown={handleCustomKeyDown}
          aria-label={searchLabel}
          className={cn(
            'pl-10 text-right h-12 border-0 ring-1 ring-zinc-300/40 shadow-none focus:border-0 focus:ring-0 focus-visible:ring-zinc-800 focus-within:ring md:text-lg placeholder:text-zinc-800/50 bg-white rounded-xl',
            {
              'ring-red-300 ring-1 focus-within:ring-red-300 focus-within:ring-1 focus-visible:ring-red-300':
                validationError && hasSubmitted,
            }
          )}
          dir="rtl"
        />
        <div
          tabIndex={-1}
          className="bg-white pr-2 absolute left-3 top-1/2 -translate-y-1/2 flex items-center h-full"
        >
          {hasActiveFiltersOrInput && (
            <button
              aria-hidden={hasActiveFiltersOrInput}
              tabIndex={hasActiveFiltersOrInput ? 0 : -1}
              onClick={resetAllStates}
              className="text-zinc-400 hover:text-zinc-700 focus:outline-none focus-visible:text-zinc-800"
              aria-label="Clear search"
            >
              <CircleX aria-hidden={hasActiveFiltersOrInput} className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PreservedErrorSpace({
  validationError,
  hasSubmitted,
}: {
  validationError: string | null;
  hasSubmitted: boolean;
}) {
  {
    /* Error message container with fixed height to prevent layout shift */
  }
  return (
    <div tabIndex={-1} className={cn('mb-2 h-4 flex justify-between items-center')}>
      {validationError && hasSubmitted && (
        <p tabIndex={-1} className={cn('text-red-500 text-xs md:text-base text-right')}>
          {validationError}
        </p>
      )}
    </div>
  );
}
