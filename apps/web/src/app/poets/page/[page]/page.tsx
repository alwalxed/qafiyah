import { SITE_URL } from '@/constants/site';
import { NOT_FOUND_TITLE } from '@/lib/constants';
import type { Metadata } from 'next';
import PoetsClientPage from './client';

export const runtime = 'edge';

type Props = {
  params: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;

  if (page) {
    return {
      title: 'قافية | تصفح حسب الدواوين',
      openGraph: {
        url: `${SITE_URL}/poets/page/${page || 1}`,
        title: 'قافية | تصفح حسب الدواوين',
      },
      twitter: {
        title: 'قافية | تصفح حسب الدواوين',
      },
    };
  }
  return {
    title: NOT_FOUND_TITLE,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function Page() {
  return <PoetsClientPage />;
}
