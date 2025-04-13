'use client';

import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { PaginationLink } from '@/components/ui/pagination-link';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { getThemePoems } from '@/lib/api/queries';
import { toArabicDigits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import type { Key } from 'react';

export default function ThemePoemsPage() {
  const params = useParams();

  const slug = params?.slug as string;
  const pageParam = params?.page as string;
  const pageNumber = pageParam ? Number.parseInt(pageParam, 10) : 1;

  const isValidSlug = Boolean(slug);
  const isValidPage = Number.isFinite(pageNumber) && pageNumber > 0;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['themePoems', slug, pageNumber],
    queryFn: () => getThemePoems(slug, pageNumber.toString()),
    enabled: isValidPage && isValidSlug,
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
  if (isError || !data || !isValidPage || !isValidSlug) {
    return (
      <SectionWrapper>
        <ErrorMessage />
      </SectionWrapper>
    );
  }

  const { data: themeData, pagination } = data;
  const { themeDetails, poems } = themeData;

  // Use API pagination metadata if available
  const totalPages = pagination?.totalPages || Math.ceil(themeDetails.poemsCount / 30);
  const hasNextPage = pagination?.hasNextPage || pageNumber < totalPages;
  const hasPrevPage = pagination?.hasPrevPage || pageNumber > 1;

  const nextPageUrl = `/themes/${slug}/page/${pageNumber + 1}`;
  const prevPageUrl = `/themes/${slug}/page/${pageNumber - 1}`;

  const content = {
    header: `قصائد ${themeDetails.name} (${toArabicDigits(themeDetails.poemsCount)} قصيدة)`,
    headerTip: `صـ ${toArabicDigits(pageNumber)} من ${toArabicDigits(totalPages)}`,
    next: 'التالي',
    previous: 'السابق',
    noMore: 'لا توجد قصائد لهذا الموضوع.',
  };

  return (
    <SectionWrapper dynamicTitle={content.header}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {poems.length > 0 ? (
          poems.map(
            (poem: { slug: Key | null | undefined; title: string; poetName: any; meter: any }) => (
              <ListCard
                key={poem.slug}
                href={`/poems/${poem.slug}`}
                name={poem.title}
                title={`${poem.poetName} • ${poem.meter}`}
              />
            )
          )
        ) : (
          <p className="text-center text-zinc-500">{content.noMore}</p>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="flex w-full justify-between items-center gap-4 text-base md:text-lg mt-8">
          <PaginationLink href={nextPageUrl} isDisabled={!hasNextPage} prefetch={hasNextPage}>
            {content.next}
          </PaginationLink>

          <p className="text-zinc-500 text-base">{content.headerTip}</p>

          <PaginationLink href={prevPageUrl} isDisabled={!hasPrevPage} prefetch={hasPrevPage}>
            {content.previous}
          </PaginationLink>
        </nav>
      )}
    </SectionWrapper>
  );
}
