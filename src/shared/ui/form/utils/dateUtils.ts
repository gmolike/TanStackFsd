import type { Locale } from 'date-fns';
import { format, isValid, parse, parseISO } from 'date-fns';

/**
 * Format a date value with error handling
 *
 * @param date - Date value (Date object, ISO string, or null)
 * @param dateFormat - Format string
 * @param locale - Date locale
 *
 * @returns Formatted date string or empty string
 */
export const formatDateSafe = (
  date: Date | string | null | undefined,
  dateFormat: string,
  locale?: Locale,
): string => {
  if (!date) return '';

  try {
    let dateObj: Date;

    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return '';
    }

    if (!isValid(dateObj)) return '';

    return format(dateObj, dateFormat, { locale });
  } catch {
    return '';
  }
};

/**
 * Parse a date string with validation
 *
 * @param value - String value to parse
 * @param dateFormat - Expected format
 * @param locale - Date locale
 *
 * @returns Parsed Date or null if invalid
 */
export const parseDateString = (
  value: string,
  dateFormat: string,
  locale?: Locale,
): Date | null => {
  if (!value) return null;

  const parsedDate = parse(value, dateFormat, new Date(), { locale });
  return isValid(parsedDate) ? parsedDate : null;
};
