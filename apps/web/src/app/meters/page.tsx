import { defaultMetadata, SITE_URL } from '@/constants/site';
import type { Metadata } from 'next';
import MetersClientPage from './client';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'قافية | تصفح حسب البحور',
  openGraph: {
    url: `${SITE_URL}/meters`,
    title: 'قافية | تصفح حسب البحور',
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
    title: 'قافية | تصفح حسب البحور',
    images: [defaultMetadata.openGraphUrl],
  },
};

export default function Page() {
  return <MetersClientPage />;
}
