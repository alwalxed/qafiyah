import { API_URL, NOT_FOUND_TITLE, SITE_URL } from '@/constants/GLOBALS';
import { htmlHeadMetadata } from '@/constants/SITE_METADATA';
import type { Metadata } from 'next';
import { toArabicDigits } from 'to-arabic-digits';
import PoetPoemsSlugPaginatedClientPage from './client';
export const runtime = 'edge';

type PoetInfoResponse = {
  success: boolean;
  data: {
    poet: {
      name: string;
      poemsCount: number;
      era: {
        name: string;
        slug: string;
      } | null;
    };
  };
};

type Props = {
  params: Promise<{ slug: string; page?: number }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page } = await params;

  try {
    const response = await fetch(`${API_URL}/poets/slug/${slug}`);

    if (!response.ok) {
      return {
        title: NOT_FOUND_TITLE,
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const responseJson = (await response.json()) as PoetInfoResponse;

    if (!responseJson.success) {
      return {
        title: NOT_FOUND_TITLE,
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // Extract poet information with fallbacks
    const poetData = responseJson.data.poet;
    const poetName = poetData?.name || 'شاعر غير معروف';
    const poemsCount = poetData?.poemsCount || 0;
    const eraName = poetData?.era?.name || 'غير محدد';

    const title = `قافية: ديوان «${poetName}» - صفحة (${toArabicDigits(page)})`;
    return {
      title,
      description: `قصائد الشاعر ${poetName} من العصر ال${eraName}، عدد القصائد: ${toArabicDigits(poemsCount)}`,
      keywords: `${poetName}, شعر, قصائد, العصر ال${eraName}, شاعر`,
      authors: [{ name: poetName }],
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        url: `${SITE_URL}/poets/slug/${slug}/page/${page || 1}`,
        title: `قافية | ديوان ${poetName}`,
        description: `قصائد الشاعر ${poetName} من العصر ال${eraName}، عدد القصائد: ${toArabicDigits(poemsCount)}`,
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
        title: `قافية | ديوان ${poetName}`,
        description: `قصائد الشاعر ${poetName} من العصر ال${eraName}، عدد القصائد: ${toArabicDigits(poemsCount)}`,
        images: [htmlHeadMetadata.openGraphUrl],
      },
    };
  } catch (error) {
    console.error('Error fetching poet metadata:', error);
    return {
      title: NOT_FOUND_TITLE,
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default function Page() {
  return <PoetPoemsSlugPaginatedClientPage />;
}
