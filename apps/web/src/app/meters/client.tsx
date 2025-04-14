'use client';

import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
import { getMeters } from '@/lib/api/queries';
import type { Meter } from '@/lib/api/types';
import { toArabicDigits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

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

  return (
    <SectionList title="البحور" dynamicTitle={`جميع البحور (${toArabicDigits(meters.length)} بحر)`}>
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
  );
}
