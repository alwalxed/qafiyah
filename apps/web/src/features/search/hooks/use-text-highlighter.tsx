'use client';

import { removeTashkeel } from '@/utils/texts/remove-tashkeel';
import { sanitizeArabicText } from '@/utils/texts/sanitize-arabic-text';

export function useTextHighlighter() {
  const highlightMatches = (text: string, query: string) => {
    if (!query || query.length <= 1 || !text) return text;

    // Clean and prepare the query for highlighting
    const cleanQuery = removeTashkeel(sanitizeArabicText(query.trim()));

    // If no valid query to highlight, return original text
    if (!cleanQuery) return text;

    // Split query into words for individual matching
    const queryWords = cleanQuery.split(/\s+/).filter((word) => word.length > 1);

    if (queryWords.length === 0) return text;

    // Create a safe text for rendering with highlighted matches
    let highlightedText = text;

    // Replace each query word with a highlighted version
    queryWords.forEach((word) => {
      // Create a regex that matches the word with word boundaries
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="text-red-600">$1</span>');
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return { highlightMatches };
}
