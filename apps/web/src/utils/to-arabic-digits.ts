export function toArabicDigits(input: number | string): string {
  const str =
    typeof input === 'number'
      ? Number.isFinite(input)
        ? input.toString()
        : (() => {
            throw new TypeError('Input must be a finite number.');
          })()
      : /^[\d.-]+$/.test(input)
        ? input
        : (() => {
            throw new TypeError('Invalid string input.');
          })();

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

  return str
    .split('')
    .map((char) => {
      const arabicChar = westernToArabicMap[char];
      if (arabicChar === undefined) {
        throw new Error(`Unexpected character "${char}" in number.`);
      }
      return arabicChar;
    })
    .join('');
}
