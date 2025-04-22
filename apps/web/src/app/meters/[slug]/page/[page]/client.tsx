'use client';

import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionPaginationControllers, SectionWrapper } from '@/components/ui/section-wrapper';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
import { getMeterPoems } from '@/lib/api/queries';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import type { Key } from 'react';
import { toArabicDigits } from 'to-arabic-digits';

export const runtime = 'edge';

export default function MeterSlugClientPage() {
  const params = useParams();

  const slug = params?.slug as string;
  const pageParam = params?.page as string;
  const pageNumber = pageParam ? Number.parseInt(pageParam, 10) : 1;

  const isValidSlug = Boolean(slug);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['meter-poems-slugged-paginated', slug, pageNumber],
    queryFn: () => getMeterPoems(slug, pageNumber.toString()),
  });

  if (isLoading) {
    return <SectionSkeleton title="قصائد بحر بعينه" itemsCount={10} />;
  }

  // Handle error state
  if (isError || !data || !isValidSlug || !isValidSlug) {
    return (
      <SectionWrapper>
        <ErrorMessage />
      </SectionWrapper>
    );
  }

  const { data: meterData, pagination } = data;
  const { meterDetails, poems } = meterData;

  // Use API pagination metadata if available
  const totalPages = pagination?.totalPages || Math.ceil(meterDetails.poemsCount / 30);
  const hasNextPage = pagination?.hasNextPage || pageNumber < totalPages;
  const hasPrevPage = pagination?.hasPrevPage || pageNumber > 1;

  const nextPageUrl = `/meters/${slug}/page/${pageNumber + 1}`;
  const prevPageUrl = `/meters/${slug}/page/${pageNumber - 1}`;

  const content = {
    header: `قصائد من بحر ${meterDetails.name} (${toArabicDigits(meterDetails.poemsCount)} قصيدة)`,
    headerTip: `صـ ${toArabicDigits(pageNumber)} من ${toArabicDigits(totalPages)}`,
    next: 'التالي',
    previous: 'السابق',
    noMore: 'لا توجد قصائد لهذا البحر.',
  };

  return (
    <SectionWrapper
      dynamicTitle={content.header}
      pagination={{
        totalPages,
        component: (
          <SectionPaginationControllers
            headerTip={content.headerTip}
            nextPageUrl={nextPageUrl}
            prevPageUrl={prevPageUrl}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
          />
        ),
      }}
    >
      {poems.length > 0 ? (
        poems.map((poem: { slug: Key | null | undefined; title: string; poetName: string }) => (
          <ListCard
            key={poem.slug}
            href={`/poems/${poem.slug}`}
            name={poem.title}
            title={poem.poetName}
          />
        ))
      ) : (
        <p className="text-center text-zinc-500">{content.noMore}</p>
      )}
    </SectionWrapper>
  );
}
