import { SITE_URL } from '@/constants/GLOBALS';
import { htmlHeadMetadata } from '@/constants/SITE_METADATA';
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
        url: htmlHeadMetadata.openGraphUrl,
        width: 1200,
        height: 630,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    title: 'قافية | تصفح حسب العصور',
    images: [htmlHeadMetadata.openGraphUrl],
  },
};

export default function Page() {
  return <ErasClientPage />;
}
