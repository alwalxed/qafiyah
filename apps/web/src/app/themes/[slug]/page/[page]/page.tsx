import { NOT_FOUND_TITLE, SITE_URL } from '@/constants/GLOBALS';
import { htmlHeadMetadata } from '@/constants/SITE_METADATA';
import type { Metadata } from 'next';
import { toArabicDigits } from 'to-arabic-digits';
import ThemePoemsSlugClientPage from './client';
export const runtime = 'edge';

export const THEMES = new Map([
  ['f2668136-60ce-4e37-b1e7-9efb84b3eade', 'دينية'],
  ['0a5db87f-f102-4dc0-be02-7204b2dd5f47', 'عتاب'],
  ['59887034-936a-4e8d-924c-aece9b0d8001', 'عدل'],
  ['a195a7b7-e47f-4f85-a39a-ebb919b16145', 'هجاء'],
  ['29cd60d0-3de7-4539-9e66-9b3faf928beb', 'اعتذار'],
  ['90442bec-71c4-46cc-b6e8-79dff1d4c2e7', 'ذم'],
  ['abc955a5-085d-4045-a001-bfa008d10197', 'من'],
  ['f5fd95d2-43e9-4c19-867a-c12772a090c5', 'ابتهال'],
  ['04afc4ca-8425-4cef-880c-ee4be69faa58', 'شوق'],
  ['aaed07ec-07d1-4158-b799-4fe041228b72', 'فراق'],
  ['9e68c8ef-29b5-42c5-8bb1-3ffe80372491', 'سياسية'],
  ['76add93c-9c1e-4e0d-aefc-6372adbc0070', 'جود'],
  ['61a2570d-9acc-493d-a05d-7dd2404c17ff', 'غزل'],
  ['f7e0d002-1b82-44b8-8256-91729b24a8fb', 'مدح'],
  ['517490a6-22b5-4877-a1fc-92eacdebd002', 'رثاء'],
  ['4d3b7130-376d-4b5b-bf1c-84dd2317cebb', 'نصيحة'],
  ['eea24558-4ac5-4eb4-abd7-922dc2d922b2', 'رحمة'],
  ['99c86aa0-1547-4b44-869a-7b2a6f2bed80', 'حكمة'],
  ['bc8d1beb-4a78-4a63-9c04-4215a33a3b70', 'صبر'],
  ['cd60fc23-6734-4b2d-a7b7-a11c57ba07f6', 'غير مصنف'],
  ['89590d4f-66a1-476f-bd54-b829201f8c5c', 'رومنسية'],
  ['39c7975b-86b0-46a7-9426-c03de72faf03', 'قصيرة'],
  ['3a0af9b5-5dab-43c0-8682-b6fc3c009f5c', 'معلقة'],
  ['52e6de61-7394-4ead-8782-213556e25c25', 'حزينة'],
  ['428212f7-929c-48a9-b129-7abf407085bd', 'عامة'],
  ['e3df9aa4-0e68-4ae6-abbd-3e0f8244d81b', 'أنشودة'],
  ['765ab978-d029-454d-9af1-c8ca0d3e7f90', 'وطن'],
]);

type Props = {
  params: Promise<{ slug: string; page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page } = await params;

  if (THEMES.has(slug)) {
    const themeName = THEMES.get(slug);
    const title = `قافية | قصائد ${themeName} | صفحة (${toArabicDigits(page)})`;
    return {
      title,
      openGraph: {
        url: `${SITE_URL}/themes/${slug}/page/${page || 1}`,
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
  return <ThemePoemsSlugClientPage />;
}
