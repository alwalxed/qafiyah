'use client';

import {
  DATABASE_DUMPS_URL,
  DEVELOPER_GITHUB_URL,
  DEVELOPER_INSTAGRAM_URL,
  DEVELOPER_SITE_URL,
  DEVELOPER_TWITTER_URL,
  GITHUB_REPO_URL,
  TWITTER_URL,
} from '@/constants/GLOBALS';
import { cn } from '@/utils/conversions/cn';
import React from 'react';
import { RandomPoemSlug } from './random-poem-slug';

type Props = {
  className?: string;
};

type FooterLinkProps = {
  label: string;
  href: string;
  screenReadersOnly: boolean;
};

const footerLinks: readonly FooterLinkProps[] = [
  // visible
  { label: 'البريد', href: 'mailto:contact@qafiyah.com', screenReadersOnly: false },
  { label: 'التويتر', href: TWITTER_URL, screenReadersOnly: false },
  { label: 'الكود', href: GITHUB_REPO_URL, screenReadersOnly: false },
  { label: 'القاعدة', href: DATABASE_DUMPS_URL, screenReadersOnly: false },
  { label: 'المطور', href: DEVELOPER_SITE_URL, screenReadersOnly: false },
  // screen readers only
  { label: 'تويتر المطور', href: DEVELOPER_TWITTER_URL, screenReadersOnly: true },
  { label: 'إنستغرام المطور', href: DEVELOPER_INSTAGRAM_URL, screenReadersOnly: true },
  { label: 'قتهب المطور', href: DEVELOPER_GITHUB_URL, screenReadersOnly: true },
] as const;

function FooterLink({ label, href, screenReadersOnly }: FooterLinkProps) {
  return (
    <a
      className={cn('hover:cursor-pointer hover:underline', screenReadersOnly && 'sr-only')}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}

export function Footer({ className }: Props) {
  const visibleLinks = footerLinks.filter((link) => !link.screenReadersOnly);

  return (
    <footer
      className={cn(
        'relative w-full flex justify-between items-center py-4 text-xs xss:text-sm md:text-base xl:text-lg border-t border-zinc-300/40 text-zinc-600 gap-4',
        className
      )}
    >
      <div className="flex md:gap-3 gap-[6px]">
        {visibleLinks.map((link, index) => (
          <React.Fragment key={link.href}>
            {index > 0 && <p>•</p>}
            <FooterLink {...link} />
          </React.Fragment>
        ))}

        {/* Screen reader–only links rendered separately */}
        {footerLinks
          .filter((link) => link.screenReadersOnly)
          .map((link) => (
            <FooterLink key={link.href} {...link} />
          ))}
      </div>

      <RandomPoemSlug />
    </footer>
  );
}
