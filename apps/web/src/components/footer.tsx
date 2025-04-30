'use client';

import { GITHUB_REPO_URL, TWITTER_URL } from '@/constants/GLOBALS';
import { cn } from '@/utils/conversions/cn';
import { getArabicYear } from '@/utils/dates/get-arabic-year';

const FOOTER_TITLE = 'قافية';
const FOOTER_SYMBOL = '/';
const FOOTER_YEAR = getArabicYear();

type Props = {
  className?: string;
};

export function Footer({ className }: Props) {
  return (
    <footer
      className={cn(
        'w-full flex justify-between items-center py-4 text-xs xss:text-sm md:text-base xl:text-lg border-t border-zinc-200/50 text-zinc-700/90 gap-4',
        className
      )}
    >
      <div className="flex md:gap-3 gap-[6px]">
        <a
          className="hover:cursor-pointer hover:underline"
          href="mailto:contact@qafiyah.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          بريد
        </a>
        <p>•</p>
        <a
          className="hover:cursor-pointer hover:underline"
          href={TWITTER_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          تويتر
        </a>
        <p>•</p>
        <a
          className="hover:cursor-pointer hover:underline"
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          قتهب
        </a>
      </div>

      <p>{`${FOOTER_TITLE} ${FOOTER_SYMBOL} ${FOOTER_YEAR}`}</p>
    </footer>
  );
}
