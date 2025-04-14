import { TWITTER_HANDLE } from '@/lib/constants';
import { getArabicYear } from '@/lib/utils';
import Link from 'next/link';
import { forwardRef, type ForwardedRef } from 'react';

const FOOTER_TITLE = 'قافية';
const FOOTER_SYMBOL = '©';
const FOOTER_YEAR = getArabicYear();

interface FooterProps {
  className?: string;
}

export const Footer = forwardRef(function Footer(
  { className = '' }: FooterProps,
  ref: ForwardedRef<HTMLElement>
) {
  return (
    <footer
      ref={ref}
      className={`flex justify-between items-center pb-8 lg:pb-4 py-4 text-xs xss:text-sm md:text-base xl:text-lg border-t border-zinc-200/50 text-zinc-700/80 gap-4 ${className}`}
    >
      <Link
        className="hover:cursor-pointer hover:underline"
        href={`https://x.com/${TWITTER_HANDLE}`}
        target="_blank"
      >
        تويتر
      </Link>
      <p>{`${FOOTER_TITLE} ${FOOTER_SYMBOL} ${FOOTER_YEAR}`}</p>
    </footer>
  );
});
