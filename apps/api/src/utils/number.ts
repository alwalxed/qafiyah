/**
 * Converts Western digits to Arabic digits
 * @param input Number or string to convert
 * @returns String with Arabic digits
 */
export function toArabicDigits(input: number | string): string {
  const str =
    typeof input === "number"
      ? Number.isFinite(input)
        ? input.toString()
        : (() => {
            throw new TypeError("Input must be a finite number.");
          })()
      : /^[\d.-]+$/.test(input)
        ? input
        : (() => {
            throw new TypeError("Invalid string input.");
          })();

  const westernToArabicMap: Record<string, string> = {
    "0": "٠",
    "1": "١",
    "2": "٢",
    "3": "٣",
    "4": "٤",
    "5": "٥",
    "6": "٦",
    "7": "٧",
    "8": "٨",
    "9": "٩",
    "-": "-",
    ".": ".",
  };

  return str
    .split("")
    .map((char) => {
      const arabicChar = westernToArabicMap[char];
      if (arabicChar === undefined) {
        throw new Error(`Unexpected character "${char}" in number.`);
      }
      return arabicChar;
    })
    .join("");
}

/**
 * Parses a comma-separated string of IDs into an array of positive integers.
 *
 * This function is used to safely extract a list of numeric IDs from a string like `"1,2,3"`.
 * It ensures that all values are:
 * - trimmed of extra whitespace,
 * - valid integers,
 * - greater than 0.
 *
 * If the input is `undefined`, an empty string, or contains no valid IDs,
 * the function returns `null`.
 *
 * @param ids - A comma-separated string of IDs (e.g. "1, 2, 3") or `undefined`.
 * @returns An array of positive integers, or `null` if the input is invalid or empty.
 *
 * @example
 * parseIds("1, 2, 3") // => [1, 2, 3]
 * parseIds(" 4 , -1, abc ") // => [4]
 * parseIds(undefined) // => null
 * parseIds("") // => null
 */
export const parseIds = (ids: string | undefined): number[] | null => {
  if (!ids) return null;
  try {
    const parsedIds = ids
      .split(",")
      .map((id) => {
        const num = Number.parseInt(id.trim(), 10);
        return Number.isInteger(num) && num > 0 ? num : null;
      })
      .filter((id): id is number => id !== null);

    return parsedIds.length > 0 ? parsedIds : null;
  } catch (e) {
    return null;
  }
};
