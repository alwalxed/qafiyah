import type { Metadata } from 'next';
import PoetsClientPage from './client';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'قافية | تصفح حسب الدواوين',
};

export default function Page() {
  return <PoetsClientPage />;
}
