import type { Metadata } from 'next';
import ErasClientPage from './client';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'قافية | تصفح حسب المواضيع',
};

export default function Page() {
  return <ErasClientPage />;
}
