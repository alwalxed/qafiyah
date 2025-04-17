import { defaultMetadata, SITE_URL } from '@/constants/site';
import type { Metadata } from 'next';
import RhymesClientPage from './client';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'قافية | تصفح حسب القوافي',
  openGraph: {
    url: `${SITE_URL}/rhymes`,
    title: 'قافية | تصفح حسب القوافي',
    images: [
      {
        url: defaultMetadata.openGraphUrl,
        width: 1200,
        height: 630,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    title: 'قافية | تصفح حسب القوافي',
    images: [defaultMetadata.openGraphUrl],
  },
};

export default function Page() {
  return <RhymesClientPage />;
}
