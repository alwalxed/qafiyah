import Loading from '@/app/loading';
import { API_URL, NOT_FOUND_TITLE, SITE_URL } from '@/constants/GLOBALS';
import { htmlHeadMetadata } from '@/constants/SITE_METADATA';
import type { PoemResponseData } from '@/lib/api/types';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import PoemSlugClientPage from './client';
export const runtime = 'edge';

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
        robots: { index: false, follow: false },
      };
    }

    const responseJson = (await response.json()) as { success: boolean; data: PoemResponseData };

    if (!responseJson.success) {
      return {
        title: NOT_FOUND_TITLE,
        robots: { index: false, follow: false },
      };
    }

    const poem = responseJson.data as PoemResponseData;

    const clearTitle = poem?.clearTitle || 'قصيدة';

    const data = poem?.metadata || {};
    const poet_name = data.poet_name || 'شاعر غير معروف';

    const processedContent = poem?.processedContent || {};
    const keywords = processedContent.keywords || '';

    const flattenVerses = (verses: [string, string][]): string => {
      if (!verses || !verses.length) return '';

      // For SEO, we want to include as many verses as possible within the optimal length
      // Google shows ~155-160 characters in snippets, but indexes up to 300
      const OPTIMAL_LENGTH = 300;

      let result = '';

      for (let i = 0; i < verses.length; i++) {
        const nextVerseLength = (verses[i][0]?.length || 0) + (verses[i][1]?.length || 0) + 2; // +2 for asterisks
        if (result.length + nextVerseLength > OPTIMAL_LENGTH) {
          break;
        }

        if (i > 0) result += ' * ';
        if (verses[i][0]) result += verses[i][0];
        result += ' * ';
        if (verses[i][1]) result += verses[i][1];
      }

      if (result.length > OPTIMAL_LENGTH) {
        return result.substring(0, OPTIMAL_LENGTH);
      }

      return result;
    };

    const description = flattenVerses(processedContent.verses);

    const title = `${clearTitle} — ${poet_name}`;
    return {
      title,
      description,
      keywords: keywords,
      authors: [{ name: poet_name }],
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          notranslate: false,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        url: `${SITE_URL}/poems/${slug}`,
        title,
        description,
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
        card: 'summary',
        creatorId: '1570116567538475010',
        creator: '@qafiyahdotcom',
        site: '@qafiyahdotcom',
        description: `ديوان «${poet_name}» على موقع قافية`,

        images: {
          url: htmlHeadMetadata.twitterSummaryCardImageUrl,
          height: 480,
          width: 480,
          alt: `ديوان «${poet_name}» على موقع قافية`,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching poem metadata:', error);
    return {
      title: NOT_FOUND_TITLE,
      robots: { index: false, follow: false },
    };
  }
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PoemSlugClientPage />
    </Suspense>
  );
}
