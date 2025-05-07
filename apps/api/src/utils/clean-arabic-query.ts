/**
 * Cleans and sanitizes the input query, allowing only Arabic letters and spaces.
 * Removes any non-Arabic characters and reduces multiple spaces to a single space.
 *
 * @param q - The query string to sanitize
 * @returns The sanitized query string
 */
export function cleanArabicQuery(q: string): string {
  return q
    .trim()
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0621-\u064A\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
