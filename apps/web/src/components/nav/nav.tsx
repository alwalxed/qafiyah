'use client';

import { NAV_LINKS } from '@/lib/constants';
import { useMeasureElement } from '@/store/layout-store';
import { Logo } from './logo';
import { MobileMenuButton } from './mobile-menu-button';
import { NavLinks } from './nav-links';

export function Nav() {
  const navRef = useMeasureElement('nav');

  return (
    <header ref={navRef} className={`w-full z-10`}>
      <div className="w-full border-b border-zinc-200/50 py-4">
        <div className="flex justify-between items-center gap-8">
          {/* LOGO */}
          <Logo />

          {/* HAMBURGER MENU (Mobile) */}
          <MobileMenuButton />

          {/* SEARCH (Desktop) */}
          {/* <SearchForm className="relative w-5/12 max-w-md hidden md:block" /> */}

          {/* MENU (Desktop) */}
          <NavLinks links={NAV_LINKS} className="hidden md:block" />
        </div>
      </div>
    </header>
  );
}
