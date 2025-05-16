// src/shared/ui/form/fields/DateRange.tsx
import { memo } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

import type { Locale } from 'date-fns';

import { FormDescription, FormLabel } from '../Form';

import { DatePicker } from './DatePicker';
import type { BaseFieldProps } from './types';

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
 * DateRangeComponent - Date range picker with two connected date pickers
 */
const DateRangeComponent = <TFieldValues extends FieldValues = FieldValues>({
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
}: DateRangeProps<TFieldValues>) => (
  <div className={className}>
    {label && <FormLabel required={required}>{label}</FormLabel>}
    <div className="grid grid-cols-2 gap-4">
      <DatePicker
        name={startName}
        label={startLabel}
        disabled={disabled}
        dateFormat={dateFormat}
        locale={locale}
      />
      <DatePicker
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

export const DateRange = memo(DateRangeComponent);
export type { DateRangeProps };
