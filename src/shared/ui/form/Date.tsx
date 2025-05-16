import React from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { FormField } from './Context';
import type { BaseFieldProps } from './Field';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './Form';

type FormDateProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    dateFormat?: string;
    showTime?: boolean;
    min?: string;
    max?: string;
    locale?: Locale;
  };

type DateProps<TFieldValues extends FieldValues = FieldValues> = FormDateProps<TFieldValues>;

/**
 * Ein Datumspicker mit date-fns Integration für robuste Datumsverarbeitung.
 *
 * @param name - Eindeutiger Feldname für React Hook Form
 * @param label - Optionaler Label-Text über dem Datumspicker
 * @param description - Optionaler Hilfstext unter dem Datumspicker
 * @param required - Zeigt Sternchen (*) bei Pflichtfeldern an
 * @param disabled - Deaktiviert den Datumspicker
 * @param placeholder - Placeholder-Text (Standard: "Datum auswählen")
 * @param className - Zusätzliche CSS-Klassen
 * @param dateFormat - Anzeigeformat für das Datum (Standard: "dd.MM.yyyy")
 * @param showTime - Zeigt zusätzliche Zeitauswahl an (standard: false)
 * @param min - Minimaldatum (YYYY-MM-DD Format)
 * @param max - Maximaldatum (YYYY-MM-DD Format)
 * @param locale - Lokalisierung für date-fns (Standard: Deutsch)
 */
export const FormDate = <TFieldValues extends FieldValues = FieldValues>({
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
}: DateProps<TFieldValues>) => {
  const formatValue = (value: Date | string | null): string => {
    if (!value) return '';

    try {
      const date = value instanceof Date ? value : parseISO(value);

      if (showTime) {
        return format(date, "yyyy-MM-dd'T'HH:mm");
      }

      return format(date, 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  const parseValue = (value: string): Date | null => {
    if (!value) return null;

    try {
      return parseISO(value);
    } catch {
      return null;
    }
  };

  return (
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
                  value={formatValue(field.value)}
                  onChange={(e) => {
                    const parsedValue = parseValue(e.target.value);
                    field.onChange(parsedValue);
                  }}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''} `}
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
  );
};

// Alternative Date Range Picker
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

type DateRangeProps<TFieldValues extends FieldValues = FieldValues> =
  FormDateRangeProps<TFieldValues>;

/**
 * Ein Datumsbereich-Picker mit zwei verbundenen Datumspickern für Von/Bis-Bereiche.
 *
 * @param startName - Feldname für das Startdatum
 * @param endName - Feldname für das Enddatum
 * @param label - Optionaler übergeordneter Label-Text
 * @param startLabel - Label für das Startdatum (Standard: "Von")
 * @param endLabel - Label für das Enddatum (Standard: "Bis")
 * @param description - Optionaler Hilfstext unter beiden Feldern
 * @param required - Zeigt Sternchen (*) bei Pflichtfeldern an
 * @param disabled - Deaktiviert beide Datumspicker
 * @param className - Zusätzliche CSS-Klassen für den Container
 * @param dateFormat - Anzeigeformat für beide Daten
 * @param locale - Lokalisierung für date-fns
 */
export const FormDateRange = <TFieldValues extends FieldValues = FieldValues>({
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
);

export type { FormDateProps, FormDateRangeProps };
