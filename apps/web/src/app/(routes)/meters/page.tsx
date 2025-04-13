import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { getMeters } from '@/lib/api/queries';
import type { Meter } from '@/lib/api/types';
import { toArabicDigits } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'قافية | صفحة البحور',
};

export default async function MetersPage() {
  let meters: Meter[] = [];

  try {
    meters = await getMeters();
  } catch (error) {
    console.error('Failed to fetch meters:', error);
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
