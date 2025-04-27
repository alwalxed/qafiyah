'use client';

import { cn } from '@/lib/utils';
import type { SelectOption } from './select';

type Props = {
  options: [SelectOption, SelectOption];
  currentValue: string;
  onToggle: (value: string) => void;
  className?: string;
};

export function BinaryToggleButton({ options, currentValue, onToggle, className }: Props) {
  if (options.length !== 2) {
    throw new Error('BinaryToggleButton requires exactly 2 options');
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
        'relative w-full flex justify-evenly items-center min-w-[180px] h-9 md:h-11 text-sm md:text-base rounded-md border-0 ring-1 ring-zinc-300/40 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-300/50 overflow-hidden',
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
        isActive ? 'text-zinc-950 bg-zinc-400/70' : 'text-zinc-600'
      )}
    >
      {label}
    </span>
  );
}
