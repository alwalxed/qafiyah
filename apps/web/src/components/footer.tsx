'use client';

import { TWITTER_HANDLE } from '@/constants/site';
import { useMeasureElement } from '@/store/layout-store';
import { getArabicYear } from '../utils/get-arabic-year';

const FOOTER_TITLE = 'قافية';
const FOOTER_SYMBOL = '©';
const FOOTER_YEAR = getArabicYear();

export const Footer = () => {
  const footerRef = useMeasureElement('footer');

  return (
    <footer
      ref={footerRef}
      className="flex justify-between items-center pb-8 lg:pb-4 py-4 text-xs xss:text-sm md:text-base xl:text-lg border-t border-zinc-200/50 text-zinc-700/80 gap-4"
    >
      <a
        className="hover:cursor-pointer hover:underline"
        href={`https://x.com/${TWITTER_HANDLE}`}
        target="_blank"
      >
        تويتر
      </a>
      <p>{`${FOOTER_TITLE} ${FOOTER_SYMBOL} ${FOOTER_YEAR}`}</p>
    </footer>
  );
};
