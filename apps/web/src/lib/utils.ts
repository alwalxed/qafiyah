import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Converts Western digits to Arabic digits
 * If the input string contains non-digit characters, it will only convert the digits
 */
export function toArabicDigits(input: number | string): string {
  // If input is a number, convert it to string
  if (typeof input === 'number') {
    if (!Number.isFinite(input)) {
      console.warn('toArabicDigits received a non-finite number, returning empty string');
      return '';
    }
    input = input.toString();
  }

  // If input is not a string at this point, return empty string
  if (typeof input !== 'string') {
    console.warn('toArabicDigits received a non-string/non-number input, returning empty string');
    return '';
  }

  const westernToArabicMap: Record<string, string> = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
    '-': '-',
    '.': '.',
  };

  // If the string only contains digits, dots, and hyphens, convert the whole string
  if (/^[\d.-]+$/.test(input)) {
    return input
      .split('')
      .map((char) => westernToArabicMap[char] || char)
      .join('');
  }

  // Otherwise, only convert the digits in the string
  return input
    .split('')
    .map((char) => westernToArabicMap[char] || char)
    .join('');
}

/**
 * Gets the current year in Arabic digits
 */
export const getArabicYear = (): string => {
  const year = new Date().getFullYear();
  return toArabicDigits(year);
};

/**
 * Removes Arabic diacritical marks (tashkeel) from text
 */
export function removeTashkeel(text: string): string {
  const tashkeelRegex = /[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED]/g;
  return text.replace(tashkeelRegex, '');
}

/**
 * Normalizes a rhyme pattern by removing parentheses and the "ال" prefix
 */
export function normalizeRhymePattern(pattern: string): string {
  return pattern.replace(/[()]/g, '').replace(/^ال/, '').trim();
}

/**
 * Formats verse count in Arabic
 */
export function getFormattedVersesCount(verseCount: number): string {
  const arabicDigits = toArabicDigits(verseCount);
  if (verseCount === 1) {
    return `بيت`;
  } else if (verseCount === 2) {
    return `بيتان`;
  } else if (verseCount >= 3 && verseCount <= 10) {
    return `${arabicDigits} أبيات`;
  } else {
    return `${arabicDigits} بيت`;
  }
}

/**
 * Calculates and formats reading time in Arabic
 */
export function getFormattedReadTime(verseCount: number): string {
  const minutes = Math.min(Math.ceil(verseCount / 15), 17);
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
}

/**
 * Processes poem content into structured format
 */
export function processPoemContent(content: string) {
  const cleanContent = content.replace(/"/g, '');
  const lines = cleanContent.split('*');
  const verses: [string, string][] = [];

  for (let i = 0; i < lines.length; i += 2) {
    verses.push([lines[i], lines[i + 1] || '']);
  }

  const readTime = getFormattedReadTime(lines.length);
  const verseCount = verses.length;

  const sample = removeTashkeel(lines.slice(0, 3).join(' * '));
  const keywords = removeTashkeel(lines.join(' ').split(' ').join(','));

  return {
    verses,
    readTime,
    verseCount,
    sample,
    keywords,
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
