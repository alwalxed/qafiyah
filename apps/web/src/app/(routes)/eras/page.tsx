import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { getEras } from '@/lib/api/queries';
import type { Era } from '@/lib/api/types';
import { toArabicDigits } from '@/lib/utils';
import type { Metadata } from 'next';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'قافية | صفحة العصور',
};

export default async function ErasPage() {
  let eras: Era[] = [];

  try {
    eras = await getEras();
  } catch (error) {
    console.error('Failed to fetch eras:', error);
  }

  return (
    <SectionList title="العصور" dynamicTitle={`جميع العصور (${toArabicDigits(eras.length)} عصور)`}>
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
