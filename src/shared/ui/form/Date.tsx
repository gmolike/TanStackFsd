import { memo } from 'react';
import type { ChangeEvent, JSX } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { format, isValid, Locale, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { FormField } from './Context';
import type { BaseFieldProps } from './Field';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './Form';

// Types
type FormDateProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    dateFormat?: string;
    showTime?: boolean;
    min?: string;
    max?: string;
    locale?: Locale;
  };

type FormDateRangeProps<TFieldValues extends FieldValues = FieldValues> = Omit<
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

// Constants
const DATE_INPUT_CLASSES = `
  flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
  ring-offset-background focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
`.trim();

// Utility Functions
const getErrorClasses = (hasError: boolean) =>
  hasError ? 'border-destructive focus-visible:ring-destructive' : '';

const formatDateValue = (value: Date | string | null, showTime: boolean): string => {
  if (!value) return '';

  try {
    const date = value instanceof Date ? value : parseISO(value);

    if (!isValid(date)) return '';

    return showTime ? format(date, "yyyy-MM-dd'T'HH:mm") : format(date, 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

const parseDateValue = (value: string): Date | null => {
  if (!value) return null;

  try {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const createDateChangeHandler =
  (onChange: (value: Date | null) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseDateValue(e.target.value);
    onChange(parsedValue);
  };

/**
 * FormDate - Date picker with date-fns integration for robust date handling
 *
 * @param props.name - Unique field name for React Hook Form
 * @param props.label - Optional label text above date picker
 * @param props.description - Optional help text below date picker
 * @param props.required - Shows asterisk (*) for required fields
 * @param props.disabled - Disables the date picker
 * @param props.placeholder - Placeholder text (default: "Datum auswählen")
 * @param props.className - Additional CSS classes
 * @param props.dateFormat - Display format for date (default: "dd.MM.yyyy")
 * @param props.showTime - Shows additional time selection (default: false)
 * @param props.min - Minimum date (YYYY-MM-DD format)
 * @param props.max - Maximum date (YYYY-MM-DD format)
 * @param props.locale - Localization for date-fns (default: German)
 */
export const FormDate = memo(
  <TFieldValues extends FieldValues = FieldValues>({
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
  }: FormDateProps<TFieldValues>) => (
    <FormField name={name}>
      <Controller
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className}>
            {label && <FormLabel required={required}>{label}</FormLabel>}
            <FormControl>
              <div className="relative">
                <input
                  type={showTime ? 'datetime-local' : 'date'}
                  disabled={disabled}
                  min={min}
                  max={max}
                  value={formatDateValue(field.value, showTime)}
                  onChange={createDateChangeHandler(field.onChange)}
                  className={`${DATE_INPUT_CLASSES} ${getErrorClasses(!!fieldState.error)}`}
                />
                <CalendarIcon className="pointer-events-none absolute right-3 top-3 h-4 w-4 opacity-50" />
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          </FormItem>
        )}
      />
    </FormField>
  ),
) as <TFieldValues extends FieldValues = FieldValues>(
  props: FormDateProps<TFieldValues>,
) => JSX.Element;

FormDate.displayName = 'FormDate';

/**
 * FormDateRange - Date range picker with two connected date pickers for from/to ranges
 *
 * @param props.startName - Field name for start date
 * @param props.endName - Field name for end date
 * @param props.label - Optional parent label text
 * @param props.startLabel - Label for start date (default: "Von")
 * @param props.endLabel - Label for end date (default: "Bis")
 * @param props.description - Optional help text below both fields
 * @param props.required - Shows asterisk (*) for required fields
 * @param props.disabled - Disables both date pickers
 * @param props.className - Additional CSS classes for container
 * @param props.dateFormat - Display format for both dates
 * @param props.locale - Localization for date-fns
 */
export const FormDateRange = memo(
  <TFieldValues extends FieldValues = FieldValues>({
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
  }: FormDateRangeProps<TFieldValues>) => (
    <div className={className}>
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <div className="grid grid-cols-2 gap-4">
        <FormDate
          name={startName}
          label={startLabel}
          disabled={disabled}
          dateFormat={dateFormat}
          locale={locale}
        />
        <FormDate
          name={endName}
          label={endLabel}
          disabled={disabled}
          dateFormat={dateFormat}
          locale={locale}
        />
      </div>
      {description && <FormDescription>{description}</FormDescription>}
    </div>
  ),
) as <TFieldValues extends FieldValues = FieldValues>(
  props: FormDateRangeProps<TFieldValues>,
) => JSX.Element;

FormDateRange.displayName = 'FormDateRange';

// Exports
export type { FormDateProps, FormDateRangeProps };
