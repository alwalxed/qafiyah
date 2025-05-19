'use client';

import {
  DATABASE_DUMPS_URL,
  DEVELOPER_GITHUB_URL,
  DEVELOPER_INSTAGRAM_URL,
  DEVELOPER_SITE_URL,
  DEVELOPER_TWITTER_URL,
  GITHUB_REPO_URL,
  SITE_URL,
  TWITTER_URL,
} from '@/constants/GLOBALS';
import { seoKeywords } from '@/constants/SEO_KEYWORDS';
import { cn } from '@/utils/conversions/cn';
import React from 'react';
import { RandomPoemButton } from './random-poem-button';

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
      aria-hidden={screenReadersOnly}
      tabIndex={screenReadersOnly ? -1 : 0}
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
      {/* --------------------------------------------- */}
      {/* --------------------------------------------------- */}
      {/* HIDDEN --------------------------------------------------- */}
      <section
        className="sr-only pointer-events-none text-opacity-0 opacity-0"
        aria-hidden="true"
        tabIndex={-1}
      >
        <ul>
          {seoKeywords.map((item) => (
            <li key={item} aria-hidden="true" tabIndex={-1}>
              <a href={SITE_URL} tabIndex={-1} aria-hidden="true">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </section>
      {/* ---------------------------------------------------------- */}
      {/* --------------------------------------------------- */}
      {/* --------------------------------------------- */}

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

      <RandomPoemButton />
    </footer>
  );
}
