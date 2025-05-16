import { memo } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

import type { Locale } from 'date-fns';

import { FormDescription, FormLabel } from '../Form';

import type { BaseFieldProps } from './types';

import { FormDate } from '..';

// Types
type DateRangeProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  BaseFieldProps<TFieldValues>,
  'name'
> & {
  startName: FieldPath<TFieldValues>;
  endName: FieldPath<TFieldValues>;
  startLabel?: string;
  endLabel?: string;
  dateFormat?: string;
  locale?: Locale;
};

/**
 * DateRange - Date range picker with two connected date pickers for from/to ranges
 *
 * @param props.startName - Field name for start date
 * @param props.endName - Field name for end date
 * @param props.label - Optional parent label text
 * @param props.startLabel - Label for start date (default: "Von")
 * @param props.endLabel - Label for end date (default: "Bis")
 * @param props.description - Optional help text below both fields
 * @param props.required - Shows asterisk (*) for required fields
 * @param props.disabled - Disables both date pickers
 * @param props.className - Additional CSS classes for container
 * @param props.dateFormat - Display format for both dates
 * @param props.locale - Localization for date-fns
 */
function DateRangeComponent<TFieldValues extends FieldValues = FieldValues>({
  startName,
  endName,
  label,
  startLabel = 'Von',
  endLabel = 'Bis',
  description,
  required,
  disabled,
  className,
  dateFormat,
  locale,
}: DateRangeProps<TFieldValues>) {
  return (
    <div className={className}>
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <div className="grid grid-cols-2 gap-4">
        <FormDate
          name={startName}
          label={startLabel}
          disabled={disabled}
          dateFormat={dateFormat}
          locale={locale}
        />
        <FormDate
          name={endName}
          label={endLabel}
          disabled={disabled}
          dateFormat={dateFormat}
          locale={locale}
        />
      </div>
      {description && <FormDescription>{description}</FormDescription>}
    </div>
  );
}

export const DateRange = memo(DateRangeComponent);
export type { DateRangeProps };
