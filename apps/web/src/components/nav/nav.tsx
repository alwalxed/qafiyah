'use client';

import { NAV_LINKS } from '@/constants/NAV_LINKS';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { MobileMenuButton } from './mobile-menu-button';
import { NavLinks } from './nav-links';

type Props = {
  className?: string;
};

export function Nav({ className }: Props) {
  return (
    <nav className={cn(`w-full z-10`, className)}>
      <div className="w-full py-4 ">
        <div className="flex justify-between items-center gap-8">
          <Logo />
          <MobileMenuButton />
          <NavLinks links={NAV_LINKS} className="hidden md:block" />
        </div>
      </div>
    </nav>
  );
}
