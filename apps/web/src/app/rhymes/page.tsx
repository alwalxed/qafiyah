'use client';

import { ErrorMessage } from '@/components/ui/error-message';
import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { SectionSkeleton } from '@/components/ui/skeleton-wrapper';
import { getRhymes } from '@/lib/api/queries';
import type { Rhyme } from '@/lib/api/types';
import { toArabicDigits } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export default function RhymesPage() {
  const {
    data: rhymes,
    isLoading,
    isError,
  } = useQuery<Rhyme[]>({
    queryKey: ['rhymes'],
    queryFn: getRhymes,
  });

  if (isLoading) {
    return <SectionSkeleton title="جميع القوافي" itemsCount={10} />;
  }

  // Handle error state
  if (isError || !rhymes) {
    return (
      <SectionList title="القوافي">
        <ErrorMessage />
      </SectionList>
    );
  }

  return (
    <SectionList
      title="القوافي"
      dynamicTitle={`جميع القوافي (${toArabicDigits(rhymes.length)} حرف)`}
    >
      {rhymes.length > 0 ? (
        rhymes.map(({ id, name, poemsCount, poetsCount, slug }) => (
          <ListCard
            key={id}
            name={name}
            href={`/rhymes/${slug}/page/1/`}
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
