// src/shared/ui/form/datePicker/DatePicker.tsx - MERGED VERSION
import { memo, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

import { isValid, parse } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon, X } from 'lucide-react';

import { cn } from '~/shared/lib/utils';
import {
  Button,
  Calendar,
  InputShadcn,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/shared/shadcn';

import { FormFieldWrapper } from '../fieldWrapper';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * DatePicker Component - Date selection with calendar and input
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
 * @param showReset - Whether to show reset to default button
 * @param showClear - Whether to show clear date button
 * @param allowInput - Whether to allow manual date input
 *
 * @example
 * ```tsx
 * <FormDatePicker
 *   control={form.control}
 *   name="birthDate"
 *   label="Birth Date"
 *   required
 *   placeholder="Select your birth date"
 *   max={new Date()}
 *   dateFormat="dd/MM/yyyy"
 *   showClear={true}
 *   allowInput={true}
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
  locale = de,
  showReset = true,
  showClear = true,
  allowInput = true,
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

  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  const handleInputChange = (value: string, onChange: (date: Date | null) => void) => {
    setInputValue(value);

    // Try to parse the input immediately as user types
    if (value === '') {
      onChange(null);
      return;
    }

    const parsedDate = parse(value, dateFormat, new Date(), { locale });
    if (isValid(parsedDate) && !isDateDisabled(parsedDate)) {
      onChange(parsedDate);
    }
  };

  const handleCalendarSelect = (date: Date | undefined, onChange: (date: Date | null) => void) => {
    onChange(date || null);
    setOpen(false);
    setInputValue('');
  };

  const handleClear = (onChange: (date: Date | null) => void) => {
    onChange(null);
    setInputValue('');
  };

  return (
    <FormFieldWrapper
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
      showReset={showReset}
      render={(field) => (
        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'flex-1 justify-start text-left font-normal',
                  !field.value && 'text-muted-foreground',
                )}
                disabled={isDisabled}
                type="button"
              >
                {formattedValue || placeholder}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <div className="space-y-3">
                {allowInput && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Datum eingeben ({dateFormat})</label>
                    <InputShadcn
                      type="text"
                      placeholder={dateFormat}
                      value={inputValue || formattedValue}
                      onChange={(e) => handleInputChange(e.target.value, field.onChange)}
                      autoFocus
                    />
                  </div>
                )}
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => handleCalendarSelect(date, field.onChange)}
                  disabled={isDateDisabled}
                  initialFocus={!allowInput}
                />
              </div>
            </PopoverContent>
          </Popover>
          {showClear && field.value && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleClear(field.onChange)}
              aria-label="Auswahl löschen"
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    />
  );
};

export const DatePicker = memo(Component) as typeof Component;
