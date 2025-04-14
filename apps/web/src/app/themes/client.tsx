'use client';

import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
import { getThemes } from '@/lib/api/queries';
import type { Theme } from '@/lib/api/types';
import { toArabicDigits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

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
    return <SectionSkeleton title="جميع المواضيع" itemsCount={10} />;
  }

  // Handle error state
  if (isError || !themes) {
    return (
      <SectionList title="المواضيع">
        <ErrorMessage />
      </SectionList>
    );
  }

  return (
    <SectionList
      title="المواضيع"
      dynamicTitle={`جميع المواضيع (${toArabicDigits(themes.length)} موضوع)`}
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
