'use client';

import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { PaginationLink } from '@/components/ui/pagination-link';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { getPoets } from '@/lib/api/queries';
import { toArabicDigits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const runtime = 'edge';

export default function PoetsPage() {
  const params = useParams();

  // Extract page from URL params
  const pageParam = params?.page as string;
  const pageNumber = pageParam ? Number.parseInt(pageParam, 10) : 1;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['poets', pageNumber],
    queryFn: () => getPoets(pageNumber.toString()),
    enabled: !isNaN(pageNumber) && pageNumber > 0,
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
  if (isError || !data) {
    return (
      <SectionWrapper>
        <ErrorMessage />
      </SectionWrapper>
    );
  }

  const { data: poetsData, pagination } = data;
  const { poets } = poetsData;

  // Use API pagination metadata if available
  const totalPoets = pagination?.totalItems || 0;
  const totalPages = pagination?.totalPages || Math.ceil(totalPoets / 30);
  const hasNextPage = pagination?.hasNextPage || pageNumber < totalPages;
  const hasPrevPage = pagination?.hasPrevPage || pageNumber > 1;

  const nextPageUrl = `/poets/page/${pageNumber + 1}`;
  const prevPageUrl = `/poets/page/${pageNumber - 1}`;

  const content = {
    header: `جميع الشعراء (${toArabicDigits(totalPoets)} شاعر)`,
    headerTip: `صـ ${toArabicDigits(pageNumber)} من ${toArabicDigits(totalPages)}`,
    next: 'التالي',
    previous: 'السابق',
    noMore: 'لا يوجد المزيد من الشعراء',
  };

  return (
    <SectionWrapper dynamicTitle={content.header}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {poets.length > 0 ? (
          poets.map((poet) => (
            <ListCard
              key={poet.slug}
              href={`/poets/${String(poet.slug ?? '')
                .toLowerCase()
                .replace(/^cat-poet-/, '')}/page/1`}
              name={poet.name}
              title={`${toArabicDigits(poet.poemsCount)} قصيدة`}
            />
          ))
        ) : (
          <p className="text-center text-zinc-500">{content.noMore}</p>
        )}
      </div>

      <nav className="flex w-full justify-between items-center gap-4 text-base md:text-lg mt-8">
        <PaginationLink href={nextPageUrl} isDisabled={!hasNextPage} prefetch={hasNextPage}>
          {content.next}
        </PaginationLink>

        <p className="text-zinc-500 text-base">{content.headerTip}</p>

        <PaginationLink href={prevPageUrl} isDisabled={!hasPrevPage} prefetch={hasPrevPage}>
          {content.previous}
        </PaginationLink>
      </nav>
    </SectionWrapper>
  );
}
