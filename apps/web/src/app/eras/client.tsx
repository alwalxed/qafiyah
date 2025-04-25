'use client';

import JsonLd from '@/components/json-ld';
import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
import { SITE_URL } from '@/constants/GLOBALS';
import { getEras } from '@/lib/api/queries';
import { useQuery } from '@tanstack/react-query';
import { toArabicDigits } from 'to-arabic-digits';

export const runtime = 'edge';

export default function ErasClientPage() {
  const {
    data: eras,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['eras-client-page'],
    queryFn: getEras,
  });

  if (isLoading) {
    return <SectionSkeleton title="جميع العصور" itemsCount={10} />;
  }

  // Handle error state
  if (isError || !eras) {
    return (
      <SectionList title="العصور">
        <ErrorMessage />
      </SectionList>
    );
  }

  const itemListElements = eras.map((era, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Collection',
      name: era.name,
      url: `${SITE_URL}/eras/${era.slug}/page/1`,
      description: `قصائد العصر ال${era.name} - ${toArabicDigits(era.poemsCount)} قصيدة و ${toArabicDigits(era.poetsCount)} شاعر`,
    },
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'العصور الشعرية',
    url: `${SITE_URL}/eras`,
    description: `قائمة بجميع العصور الشعرية في موقع قافية - ${toArabicDigits(eras.length)} عصر`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'قافية',
      url: SITE_URL,
    },
    numberOfItems: eras.length,
    itemListElement: itemListElements,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <SectionList title="العصور" dynamicTitle={`جميع العصور (${toArabicDigits(eras.length)} عصر)`}>
        {eras.length > 0 ? (
          eras.map(({ id, name, poemsCount, poetsCount, slug }) => (
            <ListCard
              key={id}
              name={name}
              href={`/eras/${slug}/page/1/`}
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
