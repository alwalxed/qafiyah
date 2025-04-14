'use client';

import { getRhymes } from '@/lib/api/queries';
import { toArabicDigits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage } from '../ui/error-message';
import { ListCard } from '../ui/list-card';
import { SectionList } from '../ui/section-list';
import { SectionSkeleton } from '../ui/skeleton-wrapper';

export function RhymesList() {
  const {
    data: rhymes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['rhymes-landing-list'],
    queryFn: () => getRhymes(),
  });

  if (isLoading) {
    return <SectionSkeleton title="تصفح القوافي" itemsCount={26} />;
  }

  if (error || !rhymes) {
    return (
      <SectionList title="القوافي">
        <ErrorMessage />
      </SectionList>
    );
  }

  return (
    <SectionList title="القوافي" dynamicTitle={`تصفح القوافي`}>
      {rhymes.map(({ id, name, slug, poemsCount }) => (
        <ListCard
          key={id}
          name={name}
          href={`/rhymes/${slug}/page/1/`}
          title={`${toArabicDigits(poemsCount)} قصيدة`}
        />
      ))}
    </SectionList>
  );
}
