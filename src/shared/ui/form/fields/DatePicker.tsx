import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import type { Locale } from 'date-fns';
import { format, isValid, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '~/shared/lib/utils';
import { Button } from '~/shared/shadcn/button';
import { Calendar } from '~/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/shared/ui/popover';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../Form';

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
 * DatePicker - ShadCN DatePicker with Calendar component
 *
 * @param props.name - Unique field name for React Hook Form
 * @param props.label - Optional label text above date picker
 * @param props.description - Optional help text below date picker
 * @param props.required - Shows asterisk (*) for required fields
 * @param props.disabled - Disables the date picker
 * @param props.placeholder - Placeholder text (default: "Datum auswählen")
 * @param props.className - Additional CSS classes
 * @param props.dateFormat - Display format for date (default: "dd.MM.yyyy")
 * @param props.showTime - Shows additional time selection (for future enhancement)
 * @param props.min - Minimum date
 * @param props.max - Maximum date
 * @param props.locale - Localization for date-fns (default: German)
 */
function DatePickerComponent<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder = 'Datum auswählen',
  disabled,
  className,
  dateFormat = 'dd.MM.yyyy',
  showTime = false,
  min,
  max,
  locale = de,
}: DatePickerProps<TFieldValues>) {
  const form = useFormContext();

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
                  disabled={disabled}
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
                disabled={(date) => (min && date < min) || (max && date > max) || disabled}
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
}

export const DatePicker = memo(DatePickerComponent);
export type { DatePickerProps };
