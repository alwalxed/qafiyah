import { SITE_URL } from '@/constants/site';
import type { Metadata } from 'next';
import ErasClientPage from './client';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'قافية | تصفح حسب المواضيع',
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/themes`,
    title: 'قافية | تصفح حسب المواضيع',
  },
  twitter: {
    title: 'قافية | تصفح حسب المواضيع',
  },
};

export default function Page() {
  return <ErasClientPage />;
}
