import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Props = {
  isActive?: boolean;
  isMobile?: boolean;
  children: ReactNode;
  href?: string;
  external?: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

export function NavItem({ isMobile = false, href, external, isActive, onClick, children }: Props) {
  return (
    <li className={cn(isMobile && 'w-full text-right border-b border-zinc-300/30 pb-2')}>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        className={cn(
          isMobile
            ? 'block py-2 hover:text-zinc-600'
            : 'hover:underline underline-offset-2 duration-200 hover:text-zinc-600',
          isActive && (isMobile ? 'text-zinc-900 font-bold underline' : 'text-zinc-900 underline')
        )}
        onClick={onClick}
      >
        {children}
      </a>
    </li>
  );
}
