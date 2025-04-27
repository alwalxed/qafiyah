'use client';

import type { NavLink } from '@/constants/NAV_LINKS';
import { useNavStore } from '@/stores/nav-store';
import { usePathname } from 'next/navigation';

interface NavLinksProps {
  links: NavLink[];
  className?: string;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export function NavLinks({ links, className = '', isMobile = false, onLinkClick }: NavLinksProps) {
  const pathname = usePathname();
  const { toggleMobileMenu } = useNavStore();

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  const handleLinkClick = () => {
    if (isMobile) {
      if (onLinkClick) {
        onLinkClick();
      } else {
        toggleMobileMenu(); // Fallback to directly using the store
      }
    }
  };

  return (
    <nav
      aria-label={isMobile ? 'القائمة الرئيسية (موبايل)' : 'القائمة الرئيسية'}
      className={className}
    >
      <ul
        className={
          isMobile
            ? 'flex flex-col-reverse items-end gap-4 text-sm xxs:text-xl'
            : 'flex flex-row-reverse gap-4 text-base lg:text-lg'
        }
      >
        {links.map((link) => (
          <li
            key={link.href}
            className={isMobile ? 'w-full text-right border-b border-zinc-300/30 pb-2' : ''}
          >
            <a
              href={link.href}
              className={`${
                isMobile
                  ? 'block py-2 hover:text-zinc-600'
                  : 'hover:underline underline-offset-2 duration-200 hover:text-zinc-600'
              } ${
                isActive(link.href)
                  ? isMobile
                    ? 'text-zinc-900 font-bold underline'
                    : 'text-zinc-900 underline'
                  : ''
              }`}
              target={link.external ? '_blank' : undefined}
              onClick={handleLinkClick}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
