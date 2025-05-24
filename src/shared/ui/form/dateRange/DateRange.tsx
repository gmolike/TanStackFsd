import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { FormDescription, FormLabel } from '~/shared/shadcn';

import { DatePicker } from '../datePicker';

import type { Props } from './model/types';

/**
 * DateRange Component - Two date pickers for selecting a date range
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param startName - Field name for the start date
 * @param endName - Field name for the end date
 * @param label - Main label for the date range
 * @param startLabel - Label for the start date picker
 * @param endLabel - Label for the end date picker
 * @param description - Helper text to display below the date range
 * @param required - Whether both fields are required
 * @param disabled - Whether both date pickers are disabled
 * @param className - Additional CSS classes for the container
 * @param dateFormat - Date format string for both pickers
 * @param locale - Locale for date formatting
 *
 * @example
 * ```tsx
 * const form = useForm<FormData>();
 *
 * <DateRange
 *   control={form.control}
 *   startName="startDate"
 *   endName="endDate"
 *   label="Project Duration"
 *   startLabel="Start Date"
 *   endLabel="End Date"
 *   required
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
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
}: Props<TFieldValues>) => (
  <div className={className}>
    {label && <FormLabel required={required}>{label}</FormLabel>}
    <div className="grid grid-cols-2 gap-4">
      <DatePicker
        control={control}
        name={startName}
        label={startLabel}
        disabled={disabled}
        dateFormat={dateFormat}
        locale={locale}
      />
      <DatePicker
        control={control}
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

export const DateRange = memo(Component) as typeof Component;
