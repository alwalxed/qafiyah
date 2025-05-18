'use client';

import { responsiveIconSize } from '@/constants/GLOBALS';
import { NAV_LINKS } from '@/constants/NAV_LINKS';
import { useNavStore } from '@/stores/nav-store';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { NavLinks } from './nav-links';

export function MobileMenu() {
  const { mobileMenuOpen, toggleMobileMenu } = useNavStore();

  // Handle body overflow when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div
      id="mobile-menu"
      className={`fixed overflow-auto inset-0 bg-zinc-50 z-20 pt-20 px-4 transition-transform duration-300 ease-in-out transform ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* MOBILE LINKS */}
      <NavLinks links={NAV_LINKS} isMobile={true} onLinkClick={toggleMobileMenu} />

      {/* CLOSE BUTTON */}
      <button
        tabIndex={-1}
        id="close-menu"
        className="absolute top-4 left-4 p-2 text-zinc-500 hover:text-zinc-700"
        aria-label="إغلاق القائمة"
        onClick={toggleMobileMenu}
      >
        <X className={responsiveIconSize} />
      </button>
    </div>
  );
}
