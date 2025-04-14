import { API_URL, NOT_FOUND_TITLE } from '@/lib/constants';
import { toArabicDigits } from '@/lib/utils';
import type { Metadata } from 'next';
import PoetPoemsSlugPaginatedClientPage from './client';

// Define the type for the new response format
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
  const { slug } = await params;

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

    return {
      title: `قافية | ديوان ${poetName}`,
      description: `قصائد الشاعر ${poetName} من العصر ال${eraName}، عدد القصائد: ${toArabicDigits(poemsCount)}`,
      keywords: `${poetName}, شعر, قصائد, العصر ال${eraName}, شاعر`,
      authors: [{ name: poetName }],
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    // Handle any fetch or parsing errors
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
