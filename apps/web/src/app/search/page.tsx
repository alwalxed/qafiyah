import type { Metadata } from 'next';
import SearchClientPage from './client';

export const metadata: Metadata = {
  title: 'قافية | ابحث في تسعين ألف قصيدة',
};

export default function Page() {
  return <SearchClientPage />;
}
