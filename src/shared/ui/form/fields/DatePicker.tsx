// src/shared/ui/form/fields/DatePicker.tsx
import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { Locale } from 'date-fns';
import { format, isValid, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '~/shared/lib/utils';
import { Button } from '~/shared/shadcn/button';
import { Calendar } from '~/shared/shadcn/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/shared/shadcn/popover';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../Form';
import { useForm } from '../hook';

import type { BaseFieldProps } from './types';

// Types
type DatePickerProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    dateFormat?: string;
    showTime?: boolean;
    min?: Date;
    max?: Date;
    locale?: Locale;
  };

/**
 * DatePickerComponent - ShadCN DatePicker with Calendar component
 */
const DatePickerComponent = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder = 'Datum auswählen',
  disabled,
  className,
  dateFormat = 'dd.MM.yyyy',
  min,
  max,
  locale = de,
}: DatePickerProps<TFieldValues>) => {
  const form = useForm<TFieldValues>();

  const formatDateValue = (date: Date | string | null): string => {
    if (!date) return '';

    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return '';
      return format(dateObj, dateFormat, { locale });
    } catch {
      return '';
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                  disabled={disabled || form.formState.isSubmitting}
                >
                  {field.value ? formatDateValue(field.value) : placeholder}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={field.onChange}
                disabled={(date) => (!!min && date < min) || (!!max && date > max) || !!disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const DatePicker = memo(DatePickerComponent);
export type { DatePickerProps };
