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
  const { slug } = await params;

  if (ERAS.has(slug)) {
    const eraName = ERAS.get(slug);
    return {
      title: `قافية | قصائد العصر ال${eraName}`,
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
