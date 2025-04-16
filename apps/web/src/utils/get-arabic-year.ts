import { toArabicDigits } from './to-arabic-digits';

/**
 * Converts Gregorian year to Hijri year
 * @param gregorianYear - The Gregorian year to convert
 * @returns The corresponding Hijri year
 */
export function gregorianToHijri(gregorianYear: number): number {
  // A more accurate formula for Gregorian to Hijri conversion
  // The Hijri calendar started in 622 CE, and is about 3% shorter than Gregorian
  const hijriYear = Math.floor((gregorianYear - 622) * (33 / 32));
  return hijriYear;
}

/**
 * Gets the current Hijri year in Arabic digits
 * @returns The current Hijri year in Arabic digits
 */
export function getHijriYear(): string {
  const gregorianYear = new Date().getFullYear();
  const hijriYear = gregorianToHijri(gregorianYear);
  return toArabicDigits(hijriYear);
}

/**
 * Gets the current Gregorian year in Arabic digits
 * @returns The current Gregorian year in Arabic digits
 */
export function getArabicYear(): string {
  const year = new Date().getFullYear();
  const hijriYear = gregorianToHijri(year);
  return toArabicDigits(hijriYear);
}
