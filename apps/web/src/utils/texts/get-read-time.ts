import { toArabicDigits } from '../numbers/to-arabic-digits';

const getApproximateReadTimeInMinutes = (verseCount: number): number => {
  return Math.min(Math.ceil(verseCount / 15), 17);
};

const formatReadTimeInArabic = (minutes: number): string => {
  const arabicMinutes = toArabicDigits(minutes);
  if (minutes === 1) {
    return `دقيقة`;
  } else if (minutes === 2) {
    return `دقيقتان`;
  } else if ([3, 4, 5, 6, 7, 8, 9, 10].includes(minutes)) {
    return `${arabicMinutes} دقائق`;
  } else {
    return `${arabicMinutes} دقيقة`;
  }
};

export const getFormattedReadTime = (verseCount: number): string => {
  const minutes = getApproximateReadTimeInMinutes(verseCount);
  return formatReadTimeInArabic(minutes);
};
