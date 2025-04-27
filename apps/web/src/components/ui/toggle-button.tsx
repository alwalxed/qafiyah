'use client';

import { cn } from '@/lib/utils';
import type { SelectOption } from './select';

type Props = {
  options: SelectOption[];
  currentValue: string;
  onToggle: (value: string) => void;
  className?: string;
};

export function BinaryToggleButton({ options, currentValue, onToggle, className }: Props) {
  if (options.length !== 2) {
    console.warn('BinaryToggleButton expects exactly 2 options');
  }

  const [option1, option2] = options;

  const handleToggle = () => {
    const nextOption = options.find((option) => option.value !== currentValue) || option1;
    onToggle(nextOption.value);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'relative w-full flex justify-evenly items-center font-medium min-w-[180px] h-9 md:h-11 text-sm md:text-base rounded-md border-0 ring-1 ring-zinc-300/40 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-300/50 overflow-hidden shadow-[inset_0px_0px_0px_0px_rgba(0,_0,_0,_0.05)]',
        className
      )}
      aria-pressed={currentValue === option2?.value}
    >
      {options.map((option) => (
        <ToggleItem
          key={option.value}
          label={option.label}
          isActive={currentValue === option.value}
        />
      ))}
    </button>
  );
}

function ToggleItem({ label, isActive }: { label: string; isActive: boolean }) {
  return (
    <span
      className={cn(
        'flex items-center justify-center w-full h-full text-zinc-600',
        isActive ? 'font-medium' : 'bg-zinc-200/30 text-zinc-600/85'
      )}
    >
      {label}
    </span>
  );
}
