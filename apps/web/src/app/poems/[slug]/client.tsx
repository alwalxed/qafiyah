'use client';

import Loading from '@/app/loading';
import JsonLd from '@/components/json-ld';
import { PoemDisplay } from '@/components/poem/poem-display';
import { ErrorMessage } from '@/components/ui/error-message';
import { SITE_URL } from '@/constants/GLOBALS';
import { getPoem } from '@/lib/api/queries';
import { useQuery } from '@tanstack/react-query';
import { Home, RefreshCcw } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

export const runtime = 'edge';

export default function PoemSlugClientPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const {
    data: poem,
    isLoading,
    isError,
    isFetching,
    isPending,
    refetch,
    error,
  } = useQuery({
    queryKey: ['single-slugged-poem', slug],
    queryFn: () => getPoem(slug),
  });

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <ErrorMessage message="حدث خطأ أثناء تحميل القصيدة" />
        <p className="mt-2 mb-6 text-muted-foreground">
          {error instanceof Error ? error.message : 'يرجى المحاولة مرة أخرى أو العودة لاحقًا'}
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            إعادة المحاولة
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-input text-foreground rounded-md hover:bg-muted transition-colors"
          >
            <Home className="h-4 w-4" />
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || isPending || isFetching) {
    return (
      <div className="animate-pulse flex justify-center items-center max-w-3xl mx-auto p-4 w-full h-full flex-1">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="h-10 bg-zinc-300/40 rounded-md w-3/4 mb-6"></div>
          <div className="h-6 bg-zinc-300/40 rounded-md w-1/2 mb-8"></div>
          <div className="space-y-4 w-full">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex justify-between gap-4 w-full">
                <div className="h-6 bg-zinc-300/40 rounded-md w-1/2"></div>
                <div className="h-6 bg-zinc-300/40 rounded-md w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!poem) {
    return <ErrorMessage message="لم يعثر على القصيدة" />;
  }

  const { metadata, clearTitle, processedContent, relatedPoems } = poem;
  const { verses, verseCount, keywords } = processedContent;

  const joinedVerses = verses.flat().join(' - ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: poem.clearTitle,
    headline: `${poem.clearTitle} | ${poem.metadata.poet_name}`,
    author: {
      '@type': 'Person',
      name: poem.metadata.poet_name,
      url: poem.metadata.poet_slug,
    },
    inLanguage: 'ar',
    datePublished: new Date().toISOString(),
    url: `${SITE_URL}/poems/${params.slug}`,
    isPartOf: [
      {
        '@type': 'Collection',
        name: poem.metadata.poet_name,
        url: poem.metadata.poet_slug,
      },
      {
        '@type': 'Collection',
        name: poem.metadata.era_name,
        url: poem.metadata.era_slug,
      },
    ],
    description: joinedVerses,
    keywords: keywords,
    publisher: {
      '@type': 'Organization',
      name: 'قافية',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  } as const;

  return (
    <Suspense fallback={<Loading />}>
      <>
        <JsonLd data={jsonLd} />
        <PoemDisplay
          clearTitle={clearTitle}
          metadata={metadata}
          verses={verses}
          verseCount={verseCount}
          relatedPoems={relatedPoems}
        />
      </>
    </Suspense>
  );
}
