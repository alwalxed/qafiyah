import type { SelectOption } from '@/components/ui/select';

export const ERAS = [
  { id: 1, name: 'إسلامي' },
  { id: 2, name: 'عباسي' },
  { id: 3, name: 'متأخر' },
  { id: 4, name: 'أموي' },
  { id: 5, name: 'جاهلي' },
  { id: 6, name: 'مخضرم' },
  { id: 7, name: 'أندلسي' },
  { id: 8, name: 'مملوكي' },
  { id: 9, name: 'عثماني' },
  { id: 10, name: 'أيوبي' },
];

export const METERS = [
  { id: 1, name: 'أحذ الكامل' },
  { id: 2, name: 'مشطور الرجز' },
  { id: 3, name: 'مخلع البسيط' },
  { id: 4, name: 'موشح' },
  { id: 5, name: 'القوما' },
  { id: 6, name: 'الهزج' },
  { id: 7, name: 'مجزوء الرمل' },
  { id: 8, name: 'مجزوء موشح' },
  { id: 9, name: 'منهوك' },
  { id: 10, name: 'الكامل' },
  { id: 11, name: 'المجتث' },
  { id: 12, name: 'مجزوء الطويل' },
  { id: 13, name: 'مخلع' },
  { id: 14, name: 'الدوبيت' },
  { id: 15, name: 'الوافر' },
  { id: 16, name: 'المواليا' },
  { id: 18, name: 'المديد' },
  { id: 19, name: 'الطويل' },
  { id: 20, name: 'السلسلة' },
  { id: 21, name: 'مشطور' },
  { id: 22, name: 'المقتضب' },
  { id: 23, name: 'مجزوء الوافر' },
  { id: 24, name: 'أحذ' },
  { id: 26, name: 'المضارع' },
  { id: 27, name: 'مجزوء الخفيف' },
  { id: 29, name: 'السريع' },
  { id: 30, name: 'منهوك المنسرح' },
  { id: 31, name: 'المنسرح' },
  { id: 32, name: 'مربع' },
  { id: 33, name: 'مجزوء الرجز' },
  { id: 34, name: 'المتدارك' },
  { id: 35, name: 'عدد' },
  { id: 36, name: 'المتقارب' },
  { id: 37, name: 'الرجز' },
  { id: 38, name: 'مجزوء المتقارب' },
  { id: 39, name: 'الخفيف' },
  { id: 40, name: 'مجزوء الهزج' },
  { id: 41, name: 'الرمل' },
  { id: 42, name: 'مجزوء' },
  { id: 43, name: 'البسيط' },
  { id: 44, name: 'مجزوء الكامل' },
];

export const THEMES = [
  { id: 1, name: 'دينية' },
  { id: 2, name: 'عتاب' },
  { id: 3, name: 'عدل' },
  { id: 4, name: 'هجاء' },
  { id: 5, name: 'اعتذار' },
  { id: 6, name: 'رومنسية' },
  { id: 7, name: 'ذم' },
  { id: 9, name: 'من' },
  { id: 10, name: 'ابتهال' },
  { id: 11, name: 'شوق' },
  { id: 12, name: 'قصيرة' },
  { id: 13, name: 'فراق' },
  { id: 14, name: 'سياسية' },
  { id: 15, name: 'جود' },
  { id: 16, name: 'معلقة' },
  { id: 17, name: 'غزل' },
  { id: 18, name: 'مدح' },
  { id: 19, name: 'رثاء' },
  { id: 20, name: 'نصيحة' },
  { id: 21, name: 'حزينة' },
  { id: 22, name: 'رحمة' },
  { id: 23, name: 'حكمة' },
  { id: 24, name: 'عامة' },
  { id: 25, name: 'أنشودة' },
  { id: 26, name: 'صبر' },
  { id: 27, name: 'وطن' },
];

export const RHYMES = [
  { id: 1, name: 'الميم' },
  { id: 2, name: 'الهاء' },
  { id: 3, name: 'الظاء' },
  { id: 4, name: 'الواو' },
  { id: 6, name: 'الشين' },
  { id: 7, name: 'الزاى' },
  { id: 8, name: 'النون' },
  { id: 13, name: 'الدال' },
  { id: 14, name: 'الفاء' },
  { id: 15, name: 'الباء' },
  { id: 16, name: 'الخاء' },
  { id: 17, name: 'الياء' },
  { id: 18, name: 'الضاد' },
  { id: 19, name: 'التاء' },
  { id: 20, name: 'اللام' },
  { id: 24, name: 'الحاء' },
  { id: 26, name: 'السين' },
  { id: 30, name: 'الطاء' },
  { id: 31, name: 'الكاف' },
  { id: 34, name: 'الثاء' },
  { id: 35, name: 'الراء' },
  { id: 36, name: 'الألف' },
  { id: 38, name: 'الغين' },
  { id: 39, name: 'الذال' },
  { id: 41, name: 'الهمزة' },
  { id: 42, name: 'الجيم' },
  { id: 43, name: 'الصاد' },
  { id: 44, name: 'القاف' },
  { id: 45, name: 'العين' },
];

export const searchTypeOptions: SelectOption[] = [
  { value: 'poems', label: 'عن بيت أو قصيدة' },
  { value: 'poets', label: 'عن شاعر أو شاعرة' },
];

export const matchTypeOptions: SelectOption[] = [
  { value: 'all', label: 'كل الكلمات' },
  { value: 'exact', label: 'كل الكلمات (متتالية)' },
  { value: 'any', label: 'بعض الكلمات' },
];

export const erasOptions: SelectOption[] = ERAS.map((era) => ({
  value: era.id.toString(),
  label: era.name,
}));

export const rhymesOptions: SelectOption[] = RHYMES.map((rhyme) => ({
  value: rhyme.id.toString(),
  label: rhyme.name,
}));

export const metersOptions: SelectOption[] = METERS.map((meter) => ({
  value: meter.id.toString(),
  label: meter.name,
}));

export const themesOptions: SelectOption[] = THEMES.map((theme) => ({
  value: theme.id.toString(),
  label: theme.name,
}));
