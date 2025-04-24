'use client';

import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
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

  return (
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
  );
}
