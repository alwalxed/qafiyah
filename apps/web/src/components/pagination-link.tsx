'use client';

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
      className={isDisabled ? 'cursor-not-allowed text-zinc-500' : 'text-zinc-800'}
      aria-disabled={isDisabled}
      onClick={(e) => isDisabled && e.preventDefault()}
    >
      {children}
    </a>
  );
}
