import { toArabicDigits } from "./number";

/**
 * Calculates approximate reading time in minutes based on verse count
 * @param verseCount Number of verses
 * @returns Reading time in minutes
 */
const getApproximateReadTimeInMinutes = (verseCount: number): number => {
  return Math.min(Math.ceil(verseCount / 15), 17);
};

/**
 * Formats reading time in Arabic with proper grammar
 * @param minutes Number of minutes
 * @returns Formatted time string in Arabic
 */
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

/**
 * Gets formatted reading time based on verse count
 * @param verseCount Number of verses
 * @returns Formatted reading time in Arabic
 */
export const getFormattedReadTime = (verseCount: number): string => {
  const minutes = getApproximateReadTimeInMinutes(verseCount);
  return formatReadTimeInArabic(minutes);
};
