'use client';

import { cn } from '@/lib/utils';
import { formatArabicCount, type ArabicNounForms } from 'arabic-count-format';
import { Check, ChevronDown, X } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface CheckboxSelectProps {
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholderNounForms: ArabicNounForms;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
}

export function CheckboxSelect({
  options,
  value,
  onChange,
  placeholderNounForms,
  placeholder,
  disabled = false,
  className,
  multiple = false,
}: CheckboxSelectProps) {
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
    (option: SelectOption) => {
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
          'flex items-center justify-between w-full h-9 md:h-11 px-3 py-2 text-sm md:text-base border border-zinc-300/80 rounded-md shadow-none bg-white/90 text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-300',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-input'
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
            'absolute z-50 w-full mt-2 overflow-auto bg-background border rounded-md shadow-md',
            'max-h-60 focus:outline-none'
          )}
          role="listbox"
          aria-multiselectable={multiple}
          aria-activedescendant={`option-${highlightedIndex}`}
        >
          {options.map((option, index) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <li
                key={option.value}
                id={`option-${index}`}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  'px-0.5 py-2 text-sm cursor-pointer',
                  index === highlightedIndex && 'bg-muted',
                  isSelected && 'font-medium'
                )}
                onClick={() => toggleOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex items-center justify-center w-4 h-4 mr-4 border rounded',
                      multiple ? 'rounded' : 'rounded-full',
                      isSelected ? 'bg-primary border-primary' : 'border-input'
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
