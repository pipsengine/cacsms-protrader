// Date Utilities: Date/time parsing and formatting helpers
export function parseDate(value: string): Date | null {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDate(date: Date): string {
  return date.toISOString();
}
