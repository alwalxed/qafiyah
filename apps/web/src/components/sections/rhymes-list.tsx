'use client';

import { getRhymes } from '@/lib/api/queries';
import { toArabicDigits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage } from '../ui/error-message';
import { ListCard } from '../ui/list-card';
import { LoadingSkeleton } from '../ui/loading-skeleton';
import { SectionList } from '../ui/section-list';

export function RhymesList() {
  const {
    data: rhymes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['rhymes'],
    queryFn: () => getRhymes(),
  });

  if (isLoading) {
    return (
      <SectionList title="القوافي">
        <LoadingSkeleton count={5} />
      </SectionList>
    );
  }

  if (error || !rhymes) {
    return (
      <SectionList title="القوافي">
        <ErrorMessage />
      </SectionList>
    );
  }

  return (
    <SectionList
      title="القوافي"
      dynamicTitle={`حروف القافية (${toArabicDigits(rhymes.length)} حرف)`}
    >
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
