import type { Poem } from "../types";

/**
 * Extracts a random excerpt from a poem
 * @param poem Poem object
 * @returns Formatted excerpt with poet name
 */
export function extractPoemExcerpt(poem: Poem): string {
  // Use a single split operation and cache the result
  const lines = poem.content.split("*");
  const lineCount = lines.length;

  // Quick validation
  if (lineCount < 2) {
    throw new Error("Poem has insufficient content for formatting");
  }

  // Optimize random selection - avoid Math.floor and division when possible
  // Ensure we get an even index for proper verse selection
  const maxStartIndex = Math.max(0, lineCount - 2);
  const randomIndex = Math.floor(Math.random() * (maxStartIndex / 2)) * 2;

  // Direct string concatenation is faster than array join
  const line1 = lines[randomIndex] || "";
  const line2 = lines[randomIndex + 1] || "";

  // Use template literals for faster string concatenation
  // Apply regex replacement only once at the end
  return `${line1}\n${line2}\n\n${poem.poet_name}`.replace(/"/g, "").trim();
}
