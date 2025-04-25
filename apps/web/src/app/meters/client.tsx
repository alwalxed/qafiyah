'use client';

import JsonLd from '@/components/json-ld';
import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
import { SITE_URL } from '@/constants/GLOBALS';
import { getMeters } from '@/lib/api/queries';
import type { Meter } from '@/lib/api/types';
import { useQuery } from '@tanstack/react-query';
import { toArabicDigits } from 'to-arabic-digits';

export default function MetersClientPage() {
  const {
    data: meters,
    isLoading,
    isError,
  } = useQuery<Meter[]>({
    queryKey: ['meters-client-page'],
    queryFn: getMeters,
  });

  if (isLoading) {
    return <SectionSkeleton title="جميع البحور" itemsCount={10} />;
  }

  // Handle error state
  if (isError || !meters) {
    return (
      <SectionList title="البحور">
        <ErrorMessage />
      </SectionList>
    );
  }

  const itemListElements = meters.map((meter, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Collection',
      name: meter.name,
      url: `${SITE_URL}/meters/${meter.slug}/page/1`,
      description: `قصائد من بحر ${meter.name} - ${toArabicDigits(meter.poemsCount)} قصيدة و ${toArabicDigits(meter.poetsCount)} شاعر`,
    },
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'البحور الشعرية',
    url: `${SITE_URL}/meters`,
    description: `قائمة بجميع البحور الشعرية في موقع قافية - ${toArabicDigits(meters.length)} بحر`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'قافية',
      url: SITE_URL,
    },
    numberOfItems: meters.length,
    itemListElement: itemListElements,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <SectionList
        title="البحور"
        dynamicTitle={`جميع البحور (${toArabicDigits(meters.length)} بحر)`}
      >
        {meters.length > 0 ? (
          meters.map(({ id, name, poemsCount, poetsCount, slug }) => (
            <ListCard
              key={id}
              name={name}
              href={`/meters/${slug}/page/1/`}
              title={`${toArabicDigits(poetsCount)} شاعر و ${toArabicDigits(poemsCount)} قصيدة`}
            />
          ))
        ) : (
          <div className="text-red-500 text-center py-8">
            حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
          </div>
        )}
      </SectionList>
    </>
  );
}
