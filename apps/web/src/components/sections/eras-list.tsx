'use client';

import { getEras } from '@/lib/api/queries';
import { toArabicDigits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage } from '../ui/error-message';
import { ListCard } from '../ui/list-card';
import { SectionList } from '../ui/section-list';
import { SectionSkeleton } from '../ui/skeleton-wrapper';

export function ErasList() {
  const {
    data: eras,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['eras'],
    queryFn: () => getEras(),
  });

  if (isLoading) {
    return <SectionSkeleton title="تصفح العصور" itemsCount={10} />;
  }

  if (error || !eras) {
    return (
      <SectionList title="العصور">
        <ErrorMessage />
      </SectionList>
    );
  }

  return (
    <SectionList title="العصور" dynamicTitle={`تصفح العصور`}>
      {eras.map(({ id, name, poemsCount, poetsCount, slug }) => (
        <ListCard
          key={id}
          name={name}
          href={`/eras/${slug}/page/1/`}
          title={`${toArabicDigits(poetsCount)} شاعر و ${toArabicDigits(poemsCount)} قصيدة`}
        />
      ))}
    </SectionList>
  );
}
