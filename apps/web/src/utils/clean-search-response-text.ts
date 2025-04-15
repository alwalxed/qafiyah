export const cleanSearchResponseText = (text: string): string => {
  const withoutHtml = text.replace(/<\/?[^>]+(>|$)/g, '');
  return withoutHtml.replace(/[^\u0600-\u06FF\s*]/g, '');
};
