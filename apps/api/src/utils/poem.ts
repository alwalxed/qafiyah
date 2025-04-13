import type { Poem } from "../types";
import { removeTashkeel } from "./text";
import { getFormattedReadTime } from "./time";

/**
 * Processes poem content to extract verses, reading time, and other metadata
 * @param content Raw poem content
 * @returns Processed poem data
 */
export function processPoemContent(content: string) {
  const cleanContent = content.replace(/"/g, "");
  const lines = cleanContent.split("*");
  const verses: [string, string][] = [];

  for (let i = 0; i < lines.length; i += 2) {
    // Make sure both elements are strings
    const firstLine = lines[i] || "";
    const secondLine = lines[i + 1] || "";
    verses.push([firstLine, secondLine]);
  }

  const readTime = getFormattedReadTime(lines.length);
  const verseCount = verses.length;

  const sample = removeTashkeel(lines.slice(0, 3).join(" * "));
  const keywords = removeTashkeel(lines.join(" ").split(" ").join(","));

  return {
    verses,
    readTime,
    verseCount,
    sample,
    keywords,
  };
}

/**
 * Extracts a random excerpt from a poem
 * @param poem Poem object
 * @returns Formatted excerpt with poet name
 */
export function extractPoemExcerpt(poem: Poem): string {
  const lines = poem.content
    .split("*")
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    throw new Error("Poem has insufficient content for formatting");
  }

  // Select two consecutive lines from an even index
  const totalLines = lines.length;
  const evenIndex = Math.floor(Math.random() * Math.floor(totalLines / 2)) * 2;
  const selectedLines = lines
    .slice(evenIndex, Math.min(evenIndex + 2, totalLines))
    .join("\n");

  return `${selectedLines}\n\n${poem.poet_name}`.replace(/"/g, "").trim();
}
