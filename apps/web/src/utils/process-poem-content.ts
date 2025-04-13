import { getFormattedReadTime } from './get-read-time';
import { removeTashkeel } from './remove-tashkeel';

export function processPoemContent(content: string) {
  const cleanContent = content.replace(/"/g, '');
  const lines = cleanContent.split('*');
  const verses: [string, string][] = [];

  for (let i = 0; i < lines.length; i += 2) {
    verses.push([lines[i], lines[i + 1] || '']);
  }

  const readTime = getFormattedReadTime(lines.length);
  const verseCount = verses.length;

  const sample = removeTashkeel(lines.slice(0, 3).join(' * '));
  const keywords = removeTashkeel(lines.join(' ').split(' ').join(','));

  return {
    verses,
    readTime,
    verseCount,
    sample,
    keywords,
  };
}
