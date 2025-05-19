import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { FormDescription, FormLabel } from '../../Form';
import type { DateRangeProps } from '../../model/types/fieldTypes';

import { DatePicker } from './DatePicker';

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
