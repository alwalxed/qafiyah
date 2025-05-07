import { formatArabicCount } from "arabic-count-format";
import { removeTashkeel } from "./remove-tashkeel";

/**
 * Processes poem content to extract verses, reading time, and other metadata
 * @param content Raw poem content
 * @returns Processed poem data
 */
export function processPoemContent(content: string) {
  // Pre-process content once
  const cleanContent = content.replace(/"/g, "");

  // Split content only once and cache the result
  const lines = cleanContent.split("*");
  const lineCount = lines.length;

  // Pre-allocate array with known size for better memory efficiency
  const verses: [string, string][] = new Array(Math.ceil(lineCount / 2));

  // Single-pass loop with direct indexing
  for (let i = 0, j = 0; i < lineCount; i += 2, j++) {
    verses[j] = [lines[i] || "", lines[i + 1] || ""];
  }

  const readTime = formatArabicCount({
    count: lineCount,
    nounForms: { singular: "دقيقة", dual: "دقيقتان", plural: "دقائق" },
  });
  const verseCount = verses.length;

  // Process sample and keywords only once
  const firstThreeLines = lines.slice(0, 3).join(" * ");
  const sample = removeTashkeel(firstThreeLines);

  // Join once before removing tashkeel
  const allText = lines.join(" ");
  const keywords = removeTashkeel(allText.split(" ").join(","));

  return {
    verses,
    readTime,
    verseCount,
    sample,
    keywords,
  };
}
