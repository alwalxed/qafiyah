export function splitCommaSeparated(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').filter(Boolean);
}

export function joinCommaSeparated(values: string[]): string {
  return values.filter(Boolean).join(',');
}
