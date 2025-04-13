import { ListCard } from '@/components/ui/list-card';
import { SectionList } from '@/components/ui/section-list';
import { getThemes } from '@/lib/api/queries';
import type { Theme } from '@/lib/api/types';
import { toArabicDigits } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'قافية | صفحة المواضيع',
};

export default async function ThemesPage() {
  let themes: Theme[] = [];

  try {
    themes = await getThemes();
  } catch (error) {
    console.error('Failed to fetch themes:', error);
  }

  return (
    <SectionList
      title="المواضيع"
      dynamicTitle={`جميع المواضيع (${toArabicDigits(themes.length)} موضوع)`}
    >
      {themes.length > 0 ? (
        themes.map(({ id, name, poemsCount, poetsCount, slug }) => (
          <ListCard
            key={id}
            name={name}
            href={`/themes/${slug}/page/1/`}
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
