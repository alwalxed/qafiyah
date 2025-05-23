'use client';

import { responsiveIconSize } from '@/constants/GLOBALS';
import { cn } from '@/lib/utils';
import { useNavStore } from '@/stores/nav-store';
import { Menu } from 'lucide-react';

export function MobileMenuButton() {
  const { toggleMobileMenu } = useNavStore();

  return (
    <button
      id="menu-toggle"
      className="md:hidden"
      aria-label="فتح القائمة"
      onClick={toggleMobileMenu}
    >
      <Menu className={cn(responsiveIconSize, 'opacity-70')} />
    </button>
  );
}
