import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { CalendarIcon } from 'lucide-react';

import { cn } from '~/shared/lib/utils';
import { Button } from '~/shared/shadcn/button';
import { Calendar } from '~/shared/shadcn/calendar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shared/shadcn/form';
import { Popover, PopoverContent, PopoverTrigger } from '~/shared/shadcn/popover';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * DatePicker Component - Date selection field with calendar popup
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form (must be a valid path in TFieldValues)
 * @param label - Label text to display above the date picker
 * @param description - Helper text to display below the date picker
 * @param required - Whether the field is required
 * @param placeholder - Placeholder text when no date is selected
 * @param disabled - Whether the date picker is disabled
 * @param className - Additional CSS classes for the form item container
 * @param dateFormat - Date format string (using date-fns format)
 * @param min - Minimum allowed date
 * @param max - Maximum allowed date
 * @param locale - Locale for date formatting
 *
 * @example
 * ```tsx
 * const form = useForm<FormData>();
 *
 * <DatePicker
 *   control={form.control}
 *   name="birthDate"
 *   label="Birth Date"
 *   required
 *   placeholder="Select your birth date"
 *   max={new Date()}
 *   dateFormat="dd/MM/yyyy"
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
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
  locale,
}: Props<TFieldValues>) => {
  const { isDisabled, formattedValue, isDateDisabled } = useController({
    control,
    name,
    disabled,
    required,
    dateFormat,
    min,
    max,
    locale,
  });

  return (
    <FormField
      control={control}
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
                    'w-full justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                  disabled={isDisabled}
                  type="button"
                >
                  {formattedValue || placeholder}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={field.onChange}
                disabled={isDateDisabled}
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

export const DatePicker = memo(Component) as typeof Component;
