'use client';

import JsonLd from '@/components/json-ld';
import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionPaginationControllers, SectionWrapper } from '@/components/ui/section-wrapper';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
import { SITE_URL } from '@/constants/GLOBALS';
import { getPoetPoems } from '@/lib/api/queries';
import { useQuery } from '@tanstack/react-query';
import { formatArabicCount } from 'arabic-count-format';
import { useParams } from 'next/navigation';
import type { Key } from 'react';
import { toArabicDigits } from 'to-arabic-digits';

export const runtime = 'edge';

export default function PoetPoemsSlugPaginatedClientPage() {
  const params = useParams();

  const slug = params?.slug as string;
  const pageParam = params?.page as string;
  const pageNumber = pageParam ? Number.parseInt(pageParam, 10) : 1;

  const isValidSlug = Boolean(slug);
  const isValidPage = Number.isFinite(pageNumber) && pageNumber > 0;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['poet-poems-slugged-paginated', slug, pageNumber],
    queryFn: () => getPoetPoems(slug, pageNumber.toString()),
  });

  if (isLoading) {
    return <SectionSkeleton title="ديوان شاعر بعينه" itemsCount={10} />;
  }

  if (isError || !data || !isValidSlug || !isValidPage) {
    return (
      <SectionWrapper>
        <ErrorMessage />
      </SectionWrapper>
    );
  }

  // Handle loading state

  const { data: poetData, pagination } = data;
  const { poetDetails, poems } = poetData;

  // Use API pagination metadata if available
  const totalPages = pagination?.totalPages || Math.ceil(poetDetails.poemsCount / 30);
  const hasNextPage = pagination?.hasNextPage || pageNumber < totalPages;
  const hasPrevPage = pagination?.hasPrevPage || pageNumber > 1;

  const nextPageUrl = `/poets/${slug}/page/${pageNumber + 1}`;
  const prevPageUrl = `/poets/${slug}/page/${pageNumber - 1}`;

  const content = {
    header: `${poetDetails.name} (${toArabicDigits(poetDetails.poemsCount)} قصيدة)`,
    headerTip: `صـ ${toArabicDigits(pageNumber)} من ${toArabicDigits(totalPages)}`,
    next: 'التالي',
    previous: 'السابق',
    noMore: 'لا توجد قصائد لهذا الشاعر.',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: poetDetails.name,
    url: `${SITE_URL}/poets/${slug}/page/${pageNumber}`,
    description: `ديوان ${poetDetails.name} (${formatArabicCount({
      count: poetDetails.poemsCount,
      nounForms: {
        singular: 'قصيدة',
        dual: 'قصيدتان',
        plural: 'قصائد',
      },
    })})`,
    mainEntityOfPage: {
      '@type': 'CollectionPage',
      name: `ديوان ${poetDetails.name}`,
      url: `${SITE_URL}/poets/${slug}/page/1`,
    },
    workExample: poems.slice(0, 10).map((poem) => ({
      '@type': 'CreativeWork',
      name: poem.title,
      description: `قصيدة (${poem.title}) على ${poem.meter}`,
      url: `${SITE_URL}/poems/${poem.slug}`,
    })),
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
              title={`${poem.meter}`}
            />
          ))
        ) : (
          <p className="text-center text-zinc-500">{content.noMore}</p>
        )}
      </SectionWrapper>
    </>
  );
}
