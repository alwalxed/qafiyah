import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { getRhymes } from '@/lib/api/queries';
import type { Rhyme } from '@/lib/api/types';
import { toArabicDigits } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'قافية | صفحة القوافي',
};

export default async function RhymesPage() {
  let rhymes: Rhyme[] = [];

  try {
    rhymes = await getRhymes();
  } catch (error) {
    console.error('Failed to fetch rhymes:', error);
  }

  return (
    <SectionList
      title="القوافي"
      dynamicTitle={`حروف القافية (${toArabicDigits(rhymes.length)} حرف)`}
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
