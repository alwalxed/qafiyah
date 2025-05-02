'use client';

import { cn } from '@/lib/utils';
import { formatArabicCount, type ArabicNounForms } from 'arabic-count-format';
import { Check, ChevronDown, X } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type Option = {
  value: string;
  label: string;
};

type Props = {
  options: Option[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholderNounForms: ArabicNounForms;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
};

export function SelectMulti({
  options,
  value,
  onChange,
  placeholderNounForms,
  placeholder,
  disabled = false,
  className,
  multiple = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValues = useMemo(() => (Array.isArray(value) ? value : [value]), [value]);

  const toggleOpen = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const toggleOption = useCallback(
    (option: Option) => {
      if (multiple) {
        if (selectedValues.includes(option.value)) {
          onChange(selectedValues.filter((v) => v !== option.value));
        } else {
          onChange([...selectedValues, option.value]);
        }
      } else {
        onChange(option.value);
        setIsOpen(false);
      }
    },
    [multiple, onChange, selectedValues]
  );

  const clearSelection = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    onChange(multiple ? [] : '');
  };

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const option = options.find((o) => o.value === selectedValues[0]);
      return option?.label || placeholder;
    }
    return formatArabicCount({ count: selectedValues.length, nounForms: placeholderNounForms });
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    // Use mousedown instead of click for better responsiveness
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % options.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          toggleOption(options[highlightedIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, options, highlightedIndex, toggleOption]);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full min-w-[180px]', className)}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="checkbox-select-options"
    >
      <div
        className={cn(
          'flex text-zinc-600 items-center justify-between w-full h-12 px-3 py-2 text-base border-0 ring-1 ring-zinc-300/40 rounded-lg shadow-none focus:outline-none focus:ring-1 focus:ring-zinc-300',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          {
            isOpen: 'ring-2 ring-zinc-300',
          }
        )}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOpen();
          }
        }}
        tabIndex={disabled ? -1 : 0}
        aria-label="Checkbox select input"
      >
        <div className="flex items-center justify-between w-full">
          <span className={cn(selectedValues.length === 0 && 'text-zinc-600')}>
            {getDisplayValue()}
          </span>
          <div className="flex items-center">
            {selectedValues.length > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                className="mr-1 p-1 rounded-full hover:bg-muted"
                aria-label="Clear selection"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <ChevronDown
              className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <ul
          id="checkbox-select-options"
          className={cn(
            'absolute z-50 w-full overflow-auto bg-white ring-1 ring-zinc-300 p-2 rounded-lg shadow-xs shadow-zinc-300',
            'max-h-60 focus:outline-none'
          )}
          role="listbox"
          aria-multiselectable={multiple}
          aria-activedescendant={`option-${highlightedIndex}`}
          style={{
            maxHeight: '15rem',
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            marginBottom: '0.25rem',
            overflowY: 'auto',
          }}
        >
          {options
            .sort((a, b) => a.label.localeCompare(b.label, 'ar'))
            .map((option, index) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <li
                  key={option.value}
                  id={`option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    'px-0.5 py-2 rounded-md text-base cursor-pointer',
                    index === highlightedIndex && 'bg-zinc-50 ring-1 ring-zinc-300/60 font-medium',
                    isSelected && 'font-medium'
                  )}
                  onClick={() => toggleOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex items-center justify-center bg-white w-4 h-4 mr-4 border rounded',
                        multiple ? 'rounded' : 'rounded-full',
                        isSelected ? 'bg-zinc-900 border-zinc-950' : 'border-zinc-300'
                      )}
                    >
                      {isSelected &&
                        (multiple ? (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        ))}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
