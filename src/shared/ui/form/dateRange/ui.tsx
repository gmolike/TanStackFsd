import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { DatePicker } from '../datepicker';
import { FormDescription, FormLabel } from '../form';

import type { Props } from './model/types';

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
}: Props<TFieldValues>) => (
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

export const Component = memo(DateRangeComponent);
