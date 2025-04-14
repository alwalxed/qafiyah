'use client';

import { getMeters } from '@/lib/api/queries';
import { toArabicDigits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage } from '../ui/error-message';
import { ListCard } from '../ui/list-card';
import { LoadingSkeleton } from '../ui/loading-skeleton';
import { SectionList } from '../ui/section-list';

export function MetersList() {
  const {
    data: meters,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['meters'],
    queryFn: () => getMeters(),
  });

  if (isLoading) {
    return (
      <SectionList title="البحور">
        <LoadingSkeleton count={5} />
      </SectionList>
    );
  }

  if (error || !meters || !Array.isArray(meters)) {
    return (
      <SectionList title="البحور">
        <ErrorMessage />
      </SectionList>
    );
  }

  return (
    <SectionList title="البحور" dynamicTitle={`تصفح البحور`}>
      {meters.map(({ id, name, slug, poemsCount, poetsCount }) => (
        <ListCard
          key={id}
          name={name}
          href={`/meters/${slug}/page/1/`}
          title={`${toArabicDigits(poetsCount)} شاعر و ${toArabicDigits(poemsCount)} قصيدة`}
        />
      ))}
    </SectionList>
  );
}
