import { SITE_URL } from '@/constants/site';
import type { Metadata } from 'next';
import RhymesClientPage from './client';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'قافية | تصفح حسب القوافي',
  openGraph: {
    url: `${SITE_URL}/rhymes`,
    title: 'قافية | تصفح حسب القوافي',
  },
  twitter: {
    title: 'قافية | تصفح حسب القوافي',
  },
};

export default function Page() {
  return <RhymesClientPage />;
}
