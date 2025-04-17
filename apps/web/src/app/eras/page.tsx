import { defaultMetadata, SITE_URL } from '@/constants/site';
import type { Metadata } from 'next';
import ErasClientPage from './client';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'قافية | تصفح حسب العصور',
  openGraph: {
    url: `${SITE_URL}/eras`,
    title: 'قافية | تصفح حسب العصور',
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
    title: 'قافية | تصفح حسب العصور',
    images: [defaultMetadata.openGraphUrl],
  },
};

export default function Page() {
  return <ErasClientPage />;
}
