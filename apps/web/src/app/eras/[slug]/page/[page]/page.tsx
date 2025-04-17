import { SITE_URL } from '@/constants/site';
import { NOT_FOUND_TITLE } from '@/lib/constants';
import type { Metadata } from 'next';
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
    return {
      title: `قافية | قصائد ال${eraName}ين`,
      openGraph: {
        url: `${SITE_URL}/eras/slug/${slug}/page/${page || 1}`,
        title: `قافية | قصائد ال${eraName}ين`,
      },
      twitter: {
        title: `قافية | قصائد ال${eraName}ين`,
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
