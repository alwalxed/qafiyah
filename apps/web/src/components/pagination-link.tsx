'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  href: string;
  isDisabled: boolean;
  prefetch?: boolean;
  children: ReactNode;
};

export function PaginationLink({ href, isDisabled, prefetch, children }: Props) {
  return (
    <Link
      href={isDisabled ? '#' : href}
      className={isDisabled ? 'cursor-not-allowed text-zinc-500' : 'text-zinc-800'}
      aria-disabled={isDisabled}
      onClick={(e) => isDisabled && e.preventDefault()}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
}
