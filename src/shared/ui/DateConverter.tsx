import { tz, TZDate } from '@date-fns/tz';
import { format, transpose } from 'date-fns';

type Props = Date | string | null | undefined;

/**
 * Format a Date or String in to a formatted Date or string
 * @param date can be Date or string
 * @param returnValue string | date
 * @param showHourMinute boolean
 * @return Format Date as String | undefined (examples: "01.01.2025", "01.01.2025 12:00"
 * @constructor
 */

function DateConverter(
  date: Props,
  returnValue: 'string',
  showHourMinute: boolean,
): string | undefined;
function DateConverter(date: Props, returnValue: 'date', showHourMinute: boolean): Date | undefined;

function DateConverter(
  date: Props,
  returnValue: 'string' | 'date',
  showHourMinute: boolean,
): string | Date | undefined {
  if (!date) return undefined;
  const dateToFormatDateString = (localDate: Date) =>
    format(
      transpose(localDate, tz('Europe/Berlin')),
      showHourMinute ? 'dd.MM.yyyy kk:mm' : 'dd.MM.yyyy',
    );

  const dateString =
    typeof date === 'string'
      ? dateToFormatDateString(new Date(date))
      : dateToFormatDateString(date);
  if (returnValue === 'string') return dateString;
  return typeof date === 'string' ? new TZDate(date, 'Europe/Berlin') : date;
}

export default DateConverter;
