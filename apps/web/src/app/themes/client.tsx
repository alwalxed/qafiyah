'use client';

import JsonLd from '@/components/json-ld';
import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
import { SITE_URL } from '@/constants/GLOBALS';
import { getThemes } from '@/lib/api/queries';
import type { Theme } from '@/lib/api/types';
import { useQuery } from '@tanstack/react-query';
import { toArabicDigits } from 'to-arabic-digits';

export default function ThemesClientPage() {
  const {
    data: themes,
    isLoading,
    isError,
  } = useQuery<Theme[]>({
    queryKey: ['themes-client-page'],
    queryFn: getThemes,
  });

  if (isLoading) {
    return <SectionSkeleton title="جميع الأغراض" itemsCount={10} />;
  }

  // Handle error state
  if (isError || !themes) {
    return (
      <SectionList title="الأغراض">
        <ErrorMessage />
      </SectionList>
    );
  }

  const itemListElements = themes.map((theme, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Collection',
      name: theme.name,
      url: `${SITE_URL}/themes/${theme.slug}/page/1`,
      description: `قصائد ${theme.name} - ${toArabicDigits(theme.poemsCount)} قصيدة و ${toArabicDigits(theme.poetsCount)} شاعر`,
    },
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'الأغراض الشعرية',
    url: `${SITE_URL}/themes`,
    description: `قائمة بجميع الأغراض الشعرية في موقع قافية - ${toArabicDigits(themes.length)} غرض`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'قافية',
      url: SITE_URL,
    },
    numberOfItems: themes.length,
    itemListElement: itemListElements,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <SectionList
        title="الأغراض"
        dynamicTitle={`جميع الأغراض (${toArabicDigits(themes.length)} غرض)`}
      >
        {themes.length > 0 ? (
          themes.map(({ id, name, poemsCount, poetsCount, slug }) => (
            <ListCard
              key={id}
              name={name}
              href={`/themes/${slug}/page/1/`}
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
