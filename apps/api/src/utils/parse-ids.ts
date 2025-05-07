/**
 * Parse a comma-separated string of IDs into a properly formatted PostgreSQL array
 */
export function parseIds(idString?: string): string | null {
  if (!idString || idString.trim() === "") {
    return null;
  }

  // Parse the IDs into a JavaScript array
  const ids = idString
    .split(",")
    .map((id) => Number.parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id));

  // If the array is empty, return null
  if (ids.length === 0) {
    return null;
  }

  // Format the array for PostgreSQL - this is the key change
  return `{${ids.join(",")}}`;
}
