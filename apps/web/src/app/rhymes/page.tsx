import type { Metadata } from 'next';
import RhymesClientPage from './client';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'قافية | تصفح حسب القوافي',
};

export default function Page() {
  return <RhymesClientPage />;
}
