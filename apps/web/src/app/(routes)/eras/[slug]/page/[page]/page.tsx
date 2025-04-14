'use client';

import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { SectionPaginationControllers, SectionWrapper } from '@/components/ui/section-wrapper';
import { getEraPoems } from '@/lib/api/queries';
import { toArabicDigits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const runtime = 'edge';

export default function EraPage() {
  const params = useParams();

  const slug = params?.slug as string;
  const pageParam = params?.page as string;
  const pageNumber = pageParam ? Number.parseInt(pageParam, 10) : 1;

  const isValidSlug = Boolean(slug);
  const isValidPage = Number.isFinite(pageNumber) && pageNumber > 0;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['eraPoems', slug, pageNumber],
    queryFn: () => getEraPoems(slug, pageNumber.toString()),
    enabled: isValidSlug && isValidPage,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <SectionWrapper>
        <LoadingSkeleton>
          <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-24 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </LoadingSkeleton>
      </SectionWrapper>
    );
  }

  // Handle error state
  if (isError || !data || !isValidSlug || !isValidPage) {
    return (
      <SectionWrapper>
        <ErrorMessage />
      </SectionWrapper>
    );
  }

  const { data: eraData, pagination } = data;
  const { eraDetails, poems } = eraData;
  const title = `${eraDetails.name}ة`;

  // Use API pagination metadata if available
  const totalPages = pagination?.totalPages || Math.ceil(eraDetails.poemsCount / 30);
  const hasNextPage = pagination?.hasNextPage || pageNumber < totalPages;
  const hasPrevPage = pagination?.hasPrevPage || pageNumber > 1;

  const nextPageUrl = `/eras/${slug}/page/${pageNumber + 1}`;
  const prevPageUrl = `/eras/${slug}/page/${pageNumber - 1}`;

  const content = {
    header: `قصائد ${title} (${toArabicDigits(eraDetails.poemsCount)} قصيدة)`,
    headerTip: `صـ ${toArabicDigits(pageNumber)} من ${toArabicDigits(totalPages)}`,
    next: 'التالي',
    previous: 'السابق',
    noMore: 'لا توجد قصائد لهذا العصر.',
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
        poems.map((poem) => (
          <ListCard
            key={poem.slug}
            href={`/poems/${poem.slug}`}
            name={poem.title}
            title={`${poem.poetName} • ${poem.meter}`}
          />
        ))
      ) : (
        <p className="text-center text-zinc-500">{content.noMore}</p>
      )}
    </SectionWrapper>
  );
}
