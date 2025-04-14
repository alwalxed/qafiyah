import type { Metadata } from 'next';
import ErasClientPage from './client';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'قافية | تصفح حسب العصور',
};

export default function Page() {
  return <ErasClientPage />;
}
