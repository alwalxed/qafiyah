'use client';

import JsonLd from '@/components/json-ld';
import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionPaginationControllers, SectionWrapper } from '@/components/ui/section-wrapper';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
import { SITE_URL } from '@/constants/GLOBALS';
import { getRhymePoems } from '@/lib/api/queries';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import type { Key } from 'react';
import { toArabicDigits } from 'to-arabic-digits';

export const runtime = 'edge';

export default function RhymePoemsSlugClientPage() {
  const params = useParams();

  const slug = params?.slug as string;
  const pageParam = params?.page as string;
  const pageNumber = pageParam ? Number.parseInt(pageParam, 10) : 1;

  const isValidSlug = Boolean(slug);
  const isValidPage = Number.isFinite(pageNumber) && pageNumber > 0;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['rhyme-poems-slugged-paginated', slug, pageNumber],
    queryFn: () => getRhymePoems(slug, pageNumber.toString()),
  });

  // Handle loading state
  if (isLoading) {
    return <SectionSkeleton title="قصائد قافية بعينها" itemsCount={10} />;
  }

  // Handle error state
  if (isError || !data || !isValidPage || !isValidSlug) {
    return (
      <SectionWrapper>
        <ErrorMessage />
      </SectionWrapper>
    );
  }

  const { data: rhymeData, pagination } = data;
  const { rhymeDetails, poems } = rhymeData;

  // Use API pagination metadata if available
  const totalPages = pagination?.totalPages || Math.ceil(rhymeDetails.poemsCount / 30);
  const hasNextPage = pagination?.hasNextPage || pageNumber < totalPages;
  const hasPrevPage = pagination?.hasPrevPage || pageNumber > 1;

  const nextPageUrl = `/rhymes/${slug}/page/${pageNumber + 1}`;
  const prevPageUrl = `/rhymes/${slug}/page/${pageNumber - 1}`;

  const content = {
    header: `${rhymeDetails.pattern} (${toArabicDigits(rhymeDetails.poemsCount)} قصيدة)`,
    headerTip: `صـ ${toArabicDigits(pageNumber)} من ${toArabicDigits(totalPages)}`,
    next: 'التالي',
    previous: 'السابق',
    noMore: 'لا توجد قصائد لهذه القافية.',
  };

  const itemListElements = poems.map((poem, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'CreativeWork',
      name: poem.title,
      url: `${SITE_URL}/poems/${poem.slug}`,
    },
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Collection',
    name: `قصائد على قافية ${rhymeDetails.pattern}`,
    url: `${SITE_URL}/rhymes/${slug}/page/${pageNumber}`,
    description: `مجموعة قصائد على قافية ${rhymeDetails.pattern} - الصفحة ${toArabicDigits(pageNumber)} من ${toArabicDigits(totalPages)}`,
    mainEntityOfPage: {
      '@type': 'CollectionPage',
      name: `قصائد على قافية ${rhymeDetails.pattern}`,
      url: `${SITE_URL}/rhymes/${slug}/page/1`,
    },
    numberOfItems: rhymeDetails.poemsCount,
    itemListElement: itemListElements,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
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
          poems.map((poem: { slug: Key | null | undefined; title: string; meter: string }) => (
            <ListCard
              key={poem.slug}
              href={`/poems/${poem.slug}`}
              name={poem.title}
              title={poem.meter}
            />
          ))
        ) : (
          <p className="text-center text-zinc-500">{content.noMore}</p>
        )}
      </SectionWrapper>
    </>
  );
}
