'use client';

import { getPoets } from '@/lib/api/queries';
import { toArabicDigits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage } from '../ui/error-message';
import { ListCard } from '../ui/list-card';
import { SectionList } from '../ui/section-list';
import { SectionSkeleton } from '../ui/skeleton-wrapper';

export function PoetsList() {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['poets-landing-list', 1],
    queryFn: () => getPoets('1'),
  });

  if (isLoading) {
    return <SectionSkeleton title="تصفح الشعراء" itemsCount={10} />;
  }

  if (error || !response) {
    return (
      <SectionList title="الشعراء">
        <ErrorMessage />
      </SectionList>
    );
  }

  const { data: poetsData } = response;
  const { poets } = poetsData;

  return (
    <SectionList title="الشعراء">
      {poets.map(({ id, name, slug, poemsCount }) => (
        <ListCard
          key={id}
          name={name}
          href={`/poets/${slug}/page/1/`}
          title={`${toArabicDigits(poemsCount)} قصيدة`}
        />
      ))}
    </SectionList>
  );
}
