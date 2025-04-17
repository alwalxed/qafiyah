export const isArabicText = (text: string): boolean => {
  const arabicPattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0030-\u0039\s]+$/;
  return arabicPattern.test(text);
};
