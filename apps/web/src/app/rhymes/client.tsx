'use client';

import JsonLd from '@/components/json-ld';
import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
import { SITE_URL } from '@/constants/GLOBALS';
import { getRhymes } from '@/lib/api/queries';
import type { Rhyme } from '@/lib/api/types';
import { useQuery } from '@tanstack/react-query';
import { toArabicDigits } from 'to-arabic-digits';

export default function RhymesClientPage() {
  const {
    data: rhymes,
    isLoading,
    isError,
  } = useQuery<Rhyme[]>({
    queryKey: ['rhymes-client-page'],
    queryFn: getRhymes,
  });

  if (isLoading) {
    return <SectionSkeleton title="جميع القوافي" itemsCount={10} />;
  }

  // Handle error state
  if (isError || !rhymes) {
    return (
      <SectionList title="القوافي">
        <ErrorMessage />
      </SectionList>
    );
  }

  const itemListElements = rhymes.map((rhyme, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Collection',
      name: rhyme.name,
      url: `${SITE_URL}/rhymes/${rhyme.slug}/page/1`,
      description: `قصائد على قافية ${rhyme.name} - ${toArabicDigits(rhyme.poemsCount)} قصيدة و ${toArabicDigits(rhyme.poetsCount)} شاعر`,
    },
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'القوافي الشعرية',
    url: `${SITE_URL}/rhymes`,
    description: `قائمة بجميع القوافي الشعرية في موقع قافية - ${toArabicDigits(rhymes.length)} قافية`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'قافية',
      url: SITE_URL,
    },
    numberOfItems: rhymes.length,
    itemListElement: itemListElements,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <SectionList
        title="القوافي"
        dynamicTitle={`جميع القوافي (${toArabicDigits(rhymes.length)} حرف)`}
      >
        {rhymes.length > 0 ? (
          rhymes.map(({ id, name, poemsCount, poetsCount, slug }) => (
            <ListCard
              key={id}
              name={name}
              href={`/rhymes/${slug}/page/1/`}
              title={`${toArabicDigits(poetsCount)} شاعر و${toArabicDigits(poemsCount)} قصيدة`}
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
