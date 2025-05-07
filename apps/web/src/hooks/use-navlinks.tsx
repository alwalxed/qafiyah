'use client';

import { useNavStore } from '@/stores/nav-store';
import { usePathname } from 'next/navigation';

type Props = {
  isMobile?: boolean;
  onLinkClick?: () => void;
};

export function useNavLinks({ isMobile = false, onLinkClick }: Props = {}) {
  const pathname = usePathname();
  const { toggleMobileMenu } = useNavStore();

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  const handleLinkClick = () => {
    if (isMobile) {
      if (onLinkClick) {
        onLinkClick();
      } else {
        toggleMobileMenu();
      }
    }
  };

  return {
    isActive,
    handleLinkClick,
  };
}
