'use client';

import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
import { getEras } from '@/lib/api/queries';
import { toArabicDigits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export const runtime = 'edge';

export default function ErasPage() {
  const {
    data: eras,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['eras'],
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

  return (
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
  );
}
