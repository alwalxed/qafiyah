'use client';

import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const toggleOpen = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const selectOption = useCallback(
    (option: SelectOption) => {
      if (option.value !== value) {
        onChange(option.value);
      }
      setIsOpen(false);
    },
    [onChange, value]
  );

  // Close dropdown when clicking outside
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

  // Handle keyboard navigation
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
          selectOption(options[highlightedIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, highlightedIndex, options, selectOption]);

  // Reset highlighted index when opening
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.findIndex((o) => o.value === value);
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, value, options]);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full min-w-[180px]', className)}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="select-options"
      tabIndex={-1}
    >
      <div
        className={cn(
          'flex text-zinc-600 items-center justify-between w-full h-9 md:h-11 px-3 py-2 text-sm md:text-base border border-zinc-300/80 rounded-md shadow-none bg-white/90 focus:outline-none focus:ring-1 focus:ring-zinc-300',
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
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Select an option"
      >
        <span className={cn(!selectedOption && 'text-zinc-600')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </div>

      {isOpen && (
        <ul
          id="select-options"
          className={cn(
            'absolute z-50 w-full mt-1 overflow-auto bg-background border rounded-md shadow-md',
            'max-h-60 focus:outline-none'
          )}
          role="listbox"
          aria-activedescendant={`option-${highlightedIndex}`}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`option-${index}`}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer flex items-center justify-between',
                index === highlightedIndex && 'bg-muted',
                option.value === value && 'font-medium'
              )}
              onClick={() => selectOption(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              role="option"
              aria-selected={option.value === value}
            >
              <span>{option.label}</span>
              {option.value === value && <Check className="h-4 w-4 text-primary" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
