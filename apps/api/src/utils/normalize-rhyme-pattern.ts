/**
 * Normalizes a rhyme pattern by removing parentheses and the "ال" prefix
 * @param pattern The rhyme pattern to normalize
 * @returns The normalized rhyme pattern
 */
export function normalizeRhymePattern(pattern: string): string {
  return pattern.replace(/[()]/g, "").replace(/^ال/, "").trim();
}
