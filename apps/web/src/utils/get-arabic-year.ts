import { toArabicDigits } from './to-arabic-digits';

export const getArabicYear = (): string => {
  const year = new Date().getFullYear();
  return toArabicDigits(year);
};
