import { NOT_FOUND_TITLE, SITE_URL } from '@/constants/GLOBALS';
import { htmlHeadMetadata } from '@/constants/SITE_METADATA';
import type { Metadata } from 'next';
import { toArabicDigits } from 'to-arabic-digits';
import EraSlugClientPage from './client';

export const runtime = 'edge';

export const ERAS = new Map([
  ['islamic', 'إسلامي'],
  ['abbasid', 'عباسي'],
  ['umayyad', 'أموي'],
  ['jahili', 'جاهلي'],
  ['mukhadram', 'مخضرم'],
  ['andalusian', 'أندلسي'],
  ['mamluki', 'مملوكي'],
  ['ottoman', 'عثماني'],
  ['ayyubi', 'أيوبي'],
  ['late', 'متأخر'],
]);

type Props = {
  params: Promise<{ slug: string; page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page } = await params;

  if (ERAS.has(slug)) {
    const eraName = ERAS.get(slug);
    const title = `قافية | قصائد ال${eraName}ين | صفحة (${toArabicDigits(page)})`;
    return {
      title,
      openGraph: {
        url: `${SITE_URL}/eras/slug/${slug}/page/${page || 1}`,
        title,
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
        title,
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
  return <EraSlugClientPage />;
}
