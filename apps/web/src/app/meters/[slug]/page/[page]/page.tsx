import { NOT_FOUND_TITLE, SITE_URL } from '@/constants/GLOBALS';
import { htmlHeadMetadata } from '@/constants/SITE_METADATA';
import type { Metadata } from 'next';
import { toArabicDigits } from 'to-arabic-digits';
import MeterSlugClientPage from './client';
export const runtime = 'edge';

export const METERS = new Map([
  ['ahd-alkamil', 'أحذ الكامل'],
  ['mashtur-alrajz', 'مشطور الرجز'],
  ['mukhalla-albasit', 'مخلع البسيط'],
  ['muwashah', 'الموشح'],
  ['alqawma', 'القوما'],
  ['alhazaj', 'الهزج'],
  ['majzu-alramal', 'مجزوء الرمل'],
  ['majzu-muwashah', 'مجزوء موشح'],
  ['manhuk', 'المنهوك'],
  ['alkamil', 'الكامل'],
  ['almujtath', 'المجتث'],
  ['majzu-altawil', 'مجزوء الطويل'],
  ['mukhalla', 'المخلع'],
  ['aldubayt', 'الدوبيت'],
  ['alwafir', 'الوافر'],
  ['almawaliya', 'المواليا'],
  ['ghayr-musanaf', 'الغير مصنف'],
  ['al-madid', 'المديد'],
  ['altawil', 'الطويل'],
  ['alsilsila', 'السلسلة'],
  ['mashtur', 'المشطور'],
  ['almuqtadab', 'المقتضب'],
  ['majzu-alwafir', 'مجزوء الوافر'],
  ['ahd', 'الأحذ'],
  ['altafila', 'التفعيلة'],
  ['almudari', 'المضارع'],
  ['majzu-alkhafif', 'مجزوء الخفيف'],
  ['tafila', 'التفعيلة'],
  ['alsarie', 'السريع'],
  ['manhuk-almunsarih', 'منهوك المنسرح'],
  ['almunsarih', 'المنسرح'],
  ['murabba', 'المربع'],
  ['majzu-alrajz', 'مجزوء الرجز'],
  ['almutadarak', 'المتدارك'],
  ['adad', 'العدد'],
  ['almutakarib', 'المتقارب'],
  ['alrajz', 'الرجز'],
  ['majzu-almutakarib', 'مجزوء المتقارب'],
  ['alkhafif', 'الخفيف'],
  ['majzu-alhazaj', 'مجزوء الهزج'],
  ['alramal', 'الرمل'],
  ['majzu', 'المجزوء'],
  ['albasit', 'البسيط'],
  ['majzu-alkamil', 'مجزوء الكامل'],
]);

type Props = {
  params: Promise<{ slug: string; page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page } = await params;

  if (METERS.has(slug)) {
    const meterName = METERS.get(slug);
    const title = `قافية | قصائد بحر ${meterName} | صفحة (${toArabicDigits(page)})`;
    return {
      title,
      openGraph: {
        url: `${SITE_URL}/meters/page/${page || 1}`,
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
  return <MeterSlugClientPage />;
}
