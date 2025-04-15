'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type Props = {
  href: string;
  isDisabled: boolean;
  prefetch?: boolean;
  children: ReactNode;
};

export function PaginationLink({ href, isDisabled, children }: Props) {
  return (
    <a
      href={isDisabled ? '#' : href}
      className={cn('border py-0.5 px-3 rounded-md border-zinc-200', {
        'cursor-not-allowed text-zinc-500': isDisabled,
        'text-zinc-800': !isDisabled,
      })}
      aria-disabled={isDisabled}
      onClick={(e) => isDisabled && e.preventDefault()}
    >
      {children}
    </a>
  );
}
