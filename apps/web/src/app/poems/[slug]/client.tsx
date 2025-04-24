'use client';

import { PoemDisplay } from '@/components/poem/poem-display';
import { ErrorMessage } from '@/components/ui/error-message';
import { SITE_URL } from '@/constants/GLOBALS';
import { getPoem } from '@/lib/api/queries';
import { useQuery } from '@tanstack/react-query';
import { Home, RefreshCcw } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

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
    isPaused,
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

  if (isLoading || isPending || isFetching || isPaused) {
    return (
      <div className="animate-pulse max-w-3xl mx-auto p-4">
        <div className="h-10 bg-zinc-200/70 rounded-md w-3/4 mb-6"></div>
        <div className="h-6 bg-zinc-200/70 rounded-md w-1/2 mb-8"></div>
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex justify-between gap-4">
              <div className="h-6 bg-zinc-200/70 rounded-md w-1/2"></div>
              <div className="h-6 bg-zinc-200/70 rounded-md w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!poem) {
    return <ErrorMessage message="لم يتم العثور على القصيدة" />;
  }

  const { data, clearTitle, processedContent } = poem;
  const { verses, readTime, verseCount, sample, keywords } = processedContent;

  const metadata = {
    title: `${clearTitle} | ${data.poet_name}`,
    description: `قصيدة (${clearTitle}) لـ«${data.poet_name}» من بحر ${data.meter_name}، عدد أبياتها ${verseCount}، ومنها: «${sample}»`,
    url: `${SITE_URL}/poems/${slug}/`,
    keywords,
    author: data.poet_name,
    readingTime: readTime,
  };

  return (
    <PoemDisplay
      clearTitle={clearTitle}
      data={data}
      verses={verses}
      verseCount={verseCount}
      metadata={metadata}
    />
  );
}
