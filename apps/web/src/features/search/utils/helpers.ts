export function splitCommaSeparated(value: string | string[] | null | undefined): string[] {
  if (Array.isArray(value)) {
    return value.filter((v) => typeof v === 'string' && v.trim() !== '');
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }

  return [];
}

export function joinCommaSeparated(values: string[] | string | null | undefined): string {
  if (Array.isArray(values)) {
    return values
      .filter(Boolean)
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .join(',');
  }

  if (typeof values === 'string') {
    return values.trim();
  }

  return '';
}
