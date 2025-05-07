'use client';

import type { NavLink } from '@/constants/NAV_LINKS';
import { useNavLinks } from '@/hooks/use-navlinks';
import { NavItem } from './nav-item';

type Props = {
  links: NavLink[];
  className?: string;
  isMobile?: boolean;
  onLinkClick?: () => void;
};

export function NavLinks({ links, className = '', isMobile = false, onLinkClick }: Props) {
  const { isActive, handleLinkClick } = useNavLinks({
    isMobile,
    onLinkClick,
  });

  return (
    <nav
      aria-label={isMobile ? 'القائمة الرئيسية (موبايل)' : 'القائمة الرئيسية'}
      className={className}
    >
      <ul
        className={
          isMobile
            ? 'flex flex-col items-end gap-4 text-sm xxs:text-xl'
            : 'flex flex-row gap-4 text-base lg:text-lg'
        }
      >
        {links.map((link) => (
          <NavItem
            key={link.href}
            href={link.href}
            external={link.external}
            isActive={isActive(link.href)}
            isMobile={isMobile}
            onClick={handleLinkClick}
          >
            {link.name}
          </NavItem>
        ))}
      </ul>
    </nav>
  );
}
