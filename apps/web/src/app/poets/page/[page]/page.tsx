import { NOT_FOUND_TITLE, SITE_URL } from '@/constants/GLOBALS';
import { htmlHeadMetadata } from '@/constants/SITE_METADATA';
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
        images: [
          {
            url: htmlHeadMetadata.openGraphUrl,
            width: 1200,
            height: 630,
            type: 'image/png',
          },
        ],
      },
      twitter: {
        title: 'قافية | تصفح حسب الدواوين',
        images: [htmlHeadMetadata.openGraphUrl],
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
