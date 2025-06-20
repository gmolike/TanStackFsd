// src/shared/test/utils/date-helpers.ts
/**
 * Create a test date with consistent timezone handling
 */
export function createTestDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return date;
}

/**
 * Format date for consistent test comparisons
 */
export function formatTestDate(date: Date | null | undefined): string {
  if (!date) return 'No date';
  return date.toISOString().split('T')[0];
}

/**
 * Create date range for testing
 */
export function createDateRange(startDays: number, endDays: number) {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  start.setDate(start.getDate() + startDays);
  end.setDate(end.getDate() + endDays);

  return { start, end };
}
