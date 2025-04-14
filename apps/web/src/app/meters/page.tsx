import type { Metadata } from 'next';
import MetersClientPage from './client';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'قافية | تصفح حسب البحور',
};

export default function Page() {
  return <MetersClientPage />;
}
