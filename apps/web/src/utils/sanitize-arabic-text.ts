export const sanitizeArabicText = (text: string): string => {
  const arabicOnly = text.replace(/[^\u0600-\u06FF\s]/g, '');
  return arabicOnly.slice(0, 50);
};
