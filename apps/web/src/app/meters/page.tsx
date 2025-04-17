import { SITE_URL } from '@/constants/site';
import type { Metadata } from 'next';
import MetersClientPage from './client';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'قافية | تصفح حسب البحور',
  openGraph: {
    url: `${SITE_URL}/meters`,
    title: 'قافية | تصفح حسب البحور',
  },
  twitter: {
    title: 'قافية | تصفح حسب البحور',
  },
};

export default function Page() {
  return <MetersClientPage />;
}
