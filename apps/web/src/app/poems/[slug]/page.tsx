import type { ProcessedPoem } from '@/lib/api/types';
import { API_URL, NOT_FOUND_TITLE } from '@/lib/constants';
import type { Metadata } from 'next';
import PoemSlugClientPage from './client';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await fetch(`${API_URL}/poems/slug/${slug}`);

    if (!response.ok) {
      return {
        title: NOT_FOUND_TITLE,
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const responseJson = (await response.json()) as { success: boolean; data: ProcessedPoem };

    if (!responseJson.success) {
      return {
        title: NOT_FOUND_TITLE,
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // The poem data is nested inside responseJson.data with fallbacks for each property
    const poem = responseJson.data as ProcessedPoem;

    // Provide fallbacks for all properties
    const clearTitle = poem?.clearTitle || 'قصيدة';

    // Fallbacks for data properties
    const data = poem?.data || {};
    const poet_name = data.poet_name || 'شاعر غير معروف';
    const meter_name = data.meter_name || 'غير محدد';

    const processedContent = poem?.processedContent || {};
    const keywords = processedContent.keywords || '';
    const sample = processedContent.sample || '';
    const verseCount = processedContent.verseCount || 0;

    return {
      title: `${clearTitle} | ${poet_name} | قافية`,
      description: `قصيدة (${clearTitle}) لـ«${poet_name}» من بحر ${meter_name}، عدد أبياتها ${verseCount}${sample ? `، ومنها: «${sample}»` : ''}`,
      keywords: keywords,
      authors: [{ name: poet_name }],
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    // Handle any fetch or parsing errors
    console.error('Error fetching poem metadata:', error);
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
  return <PoemSlugClientPage />;
}
