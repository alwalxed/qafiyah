import { toArabicDigits } from 'to-arabic-digits';

const formatVerseNumbersInArabic = (verses: number): string => {
  const arabicDigits = toArabicDigits(verses);
  if (verses === 1) {
    return `بيت`;
  } else if (verses === 2) {
    return `بيتان`;
  } else if (verses >= 3 && verses <= 10) {
    return `${arabicDigits} أبيات`;
  } else {
    return `${arabicDigits} بيت`;
  }
};

export const getFormattedVersesCount = (verseCount: number): string => {
  return formatVerseNumbersInArabic(verseCount);
};
