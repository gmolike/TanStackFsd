import { memo } from 'react';
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from 'react-hook-form';

import { CalendarIcon } from 'lucide-react';

import { cn } from '~/shared/lib/utils';
import { Button } from '~/shared/shadcn/button';
import { Calendar } from '~/shared/shadcn/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/shared/shadcn/popover';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../Form';
import { useDatePickerController } from '../../model/controllers';
import type { DatePickerProps } from '../../model/types/fieldTypes';

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
  locale,
}: DatePickerProps<TFieldValues>) => {
  const { isDisabled, formattedValue, isDateDisabled } = useDatePickerController({
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
      name={name}
      render={({
        field,
      }: {
        field: ControllerRenderProps<TFieldValues>;
        fieldState: ControllerFieldState;
      }) => (
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
                  disabled={isDisabled}
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

export const DatePicker = memo(DatePickerComponent);
