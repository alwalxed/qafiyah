import type { Metadata } from 'next';
import SearchClientPage from './client';

export const metadata: Metadata = {
  title: 'قافية | ابحث في مليون بيت',
};

export default function Page() {
  return <SearchClientPage />;
}
