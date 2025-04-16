'use client';

import { TWITTER_HANDLE } from '@/constants/site';
import { forwardRef } from 'react';
import { getArabicYear } from '../utils/get-arabic-year';

const FOOTER_TITLE = 'قافية';
const FOOTER_SYMBOL = '/';
const FOOTER_YEAR = getArabicYear();

export const Footer = forwardRef<HTMLElement>(function Footer(_props, ref) {
  return (
    <footer
      ref={ref}
      className="w-full flex justify-between items-center py-4 text-xs xss:text-sm md:text-base xl:text-lg border-t border-zinc-200/50 text-zinc-700/90 gap-4"
    >
      <div className="flex md:gap-3 gap-[6px]">
        <a
          className="hover:cursor-pointer hover:underline"
          href={`https://x.com/${TWITTER_HANDLE}`}
          target="_blank"
          rel="noreferrer"
        >
          تويترنا
        </a>
        <p>•</p>
        <a
          className="hover:cursor-pointer hover:underline"
          href={`https://github.com/alwalxed/qafiyah`}
          target="_blank"
          rel="noreferrer"
        >
          كود الموقع
        </a>
        <p>•</p>
        <a
          className="hover:cursor-pointer hover:underline"
          href={`https://github.com/alwalxed/qafiyah/tree/main/.db_dumps`}
          target="_blank"
          rel="noreferrer"
        >
          قاعدة البيانات
        </a>
      </div>

      <p>{`${FOOTER_TITLE} ${FOOTER_SYMBOL} ${FOOTER_YEAR}`}</p>
    </footer>
  );
});
