// src/shared/ui/form/datePicker/DatePicker.tsx - REFACTORED IN THIS CHAT
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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

    // Try to parse the input
    const parsedDate = parse(value, dateFormat, new Date(), { locale });
    if (isValid(parsedDate) && !isDateDisabled(parsedDate)) {
      onChange(parsedDate);
    }
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
                  showClear && field.value && 'pr-16',
                )}
                disabled={isDisabled}
                type="button"
              >
                {formattedValue || placeholder}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="calendar">Kalender</TabsTrigger>
                  <TabsTrigger value="input">Eingabe</TabsTrigger>
                </TabsList>
                <TabsContent value="calendar" className="mt-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date);
                      setOpen(false);
                    }}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </TabsContent>
                <TabsContent value="input" className="p-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Datum eingeben ({dateFormat})</label>
                    <InputShadcn
                      type="text"
                      placeholder={dateFormat}
                      value={inputValue || formattedValue}
                      onChange={(e) => handleInputChange(e.target.value, field.onChange)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const parsedDate = parse(inputValue, dateFormat, new Date(), { locale });
                          if (isValid(parsedDate) && !isDateDisabled(parsedDate)) {
                            setOpen(false);
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Drücken Sie Enter zum Bestätigen
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
          {showClear && field.value && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => field.onChange('')}
              aria-label="Auswahl löschen"
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
