import { NOT_FOUND_CODE, NOT_FOUND_MESSAGE, NOT_FOUND_TITLE } from '@/constants/GLOBALS';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: NOT_FOUND_TITLE,
  description: NOT_FOUND_MESSAGE,
  // Prevent search engines from indexing 404 pages
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  // Override OpenGraph metadata for 404 page
  openGraph: {
    title: NOT_FOUND_TITLE,
    description: NOT_FOUND_MESSAGE,
    type: 'website',
  },
  // Override Twitter metadata for 404 page
  twitter: {
    title: NOT_FOUND_TITLE,
    description: NOT_FOUND_MESSAGE,
    card: 'summary',
  },
};

export default function NotFound() {
  return (
    <div className="h-full text-center mx-auto flex justify-center items-center flex-col gap-20">
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className="text-9xl font-bold text-zinc-700">{NOT_FOUND_CODE}</h1>
        <p className="text-4xl text-zinc-500">{NOT_FOUND_MESSAGE}</p>
      </div>
    </div>
  );
}
