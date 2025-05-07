/**
 * Removes Arabic diacritical marks (tashkeel) from text
 * @param text The text to process
 * @returns Text without tashkeel
 */
export function removeTashkeel(text: string): string {
  const tashkeelRegex = /[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED]/g;
  return text.replace(tashkeelRegex, "");
}
