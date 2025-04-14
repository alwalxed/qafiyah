'use client';

import { PoemDisplay } from '@/components/poem/poem-display';
import { ErrorMessage } from '@/components/ui/error-message';
import { getPoem } from '@/lib/api/queries';
import { SITE_URL } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const runtime = 'edge';

export default function PoemPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const {
    data: poem,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['poem', slug],
    queryFn: () => getPoem(slug),
    enabled: !!slug,
  });

  useEffect(() => {
    if (isError) {
      router.push('/404');
    }
  }, [isError, router]);

  if (isLoading) {
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

  // Handle error or no data
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
