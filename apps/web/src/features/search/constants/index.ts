import type { SelectOption } from '@/components/ui/select';

export const ERAS = [
  { id: 1, name: 'العصر الجاهلي' },
  { id: 2, name: 'العصر الإسلامي' },
  { id: 3, name: 'العصر الأموي' },
  { id: 4, name: 'العصر العباسي' },
  { id: 5, name: 'العصر الأندلسي' },
  { id: 6, name: 'العصر المملوكي' },
  { id: 7, name: 'العصر العثماني' },
  { id: 8, name: 'العصر الحديث' },
];

export const METERS = [
  { id: 1, name: 'الطويل' },
  { id: 2, name: 'المديد' },
  { id: 3, name: 'البسيط' },
  { id: 4, name: 'الوافر' },
  { id: 5, name: 'الكامل' },
  { id: 6, name: 'الهزج' },
  { id: 7, name: 'الرجز' },
  { id: 8, name: 'الرمل' },
  { id: 9, name: 'السريع' },
  { id: 10, name: 'المنسرح' },
  { id: 11, name: 'الخفيف' },
  { id: 12, name: 'المضارع' },
  { id: 13, name: 'المقتضب' },
  { id: 14, name: 'المجتث' },
  { id: 15, name: 'المتقارب' },
  { id: 16, name: 'المتدارك' },
];

export const THEMES = [
  { id: 1, name: 'المدح' },
  { id: 2, name: 'الغزل' },
  { id: 3, name: 'الرثاء' },
  { id: 4, name: 'الهجاء' },
  { id: 5, name: 'الوصف' },
  { id: 6, name: 'الحكمة' },
  { id: 7, name: 'الفخر' },
  { id: 8, name: 'الحماسة' },
  { id: 9, name: 'الزهد' },
  { id: 10, name: 'العتاب' },
];

export const searchTypeOptions: SelectOption[] = [
  { value: 'poems', label: 'Poems' },
  { value: 'poets', label: 'Poets' },
];

export const matchTypeOptions: SelectOption[] = [
  { value: 'all', label: 'All Words' },
  { value: 'any', label: 'Any Word' },
  { value: 'exact', label: 'Exact' },
];

export const erasOptions: SelectOption[] = ERAS.map((era) => ({
  value: era.id.toString(),
  label: era.name,
}));

export const metersOptions: SelectOption[] = METERS.map((meter) => ({
  value: meter.id.toString(),
  label: meter.name,
}));

export const themesOptions: SelectOption[] = THEMES.map((theme) => ({
  value: theme.id.toString(),
  label: theme.name,
}));
