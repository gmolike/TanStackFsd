// src/shared/ui/form/form-field.tsx
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { FormField } from './Context';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './Form';

type BaseFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

// Input Field Component
type FormInputProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
    autoComplete?: string;
  };

type Props<TFieldValues extends FieldValues = FieldValues> = FormInputProps<TFieldValues>;

/**
 * Ein typsicheres Input-Feld mit automatischer Validierung und Fehleranzeige.
 *
 * @param name - Eindeutiger Feldname für React Hook Form
 * @param label - Optionaler Label-Text über dem Input
 * @param description - Optionaler Hilfstext unter dem Input
 * @param required - Zeigt Sternchen (*) bei Pflichtfeldern an
 * @param disabled - Deaktiviert das Input-Feld
 * @param placeholder - Placeholder-Text im Input
 * @param className - Zusätzliche CSS-Klassen
 * @param type - HTML Input-Typ (text, email, password, etc.)
 * @param autoComplete - Browser-Autocomplete-Attribut
 */
export const FormInput = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  type = 'text',
  placeholder,
  autoComplete,
  disabled,
  className,
}: Props<TFieldValues>) => (
  <FormField name={name}>
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <input
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''} `}
              {...field}
              onChange={(e) => {
                const value = type === 'number' ? e.target.valueAsNumber : e.target.value;
                field.onChange(value);
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  </FormField>
);

// Textarea Field Component
type FormTextareaProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    rows?: number;
  };

type TextareaProps<TFieldValues extends FieldValues = FieldValues> =
  FormTextareaProps<TFieldValues>;

/**
 * Ein mehrzeiliges Textarea-Feld mit automatischer Validierung und Fehleranzeige.
 *
 * @param name - Eindeutiger Feldname für React Hook Form
 * @param label - Optionaler Label-Text über dem Textarea
 * @param description - Optionaler Hilfstext unter dem Textarea
 * @param required - Zeigt Sternchen (*) bei Pflichtfeldern an
 * @param disabled - Deaktiviert das Textarea-Feld
 * @param placeholder - Placeholder-Text im Textarea
 * @param className - Zusätzliche CSS-Klassen
 * @param rows - Anzahl der sichtbaren Textzeilen (Standard: 3)
 */
export const FormTextarea = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder,
  disabled,
  className,
  rows = 3,
}: TextareaProps<TFieldValues>) => (
  <FormField name={name}>
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <textarea
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''} `}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  </FormField>
);

export type { BaseFieldProps, FormInputProps, FormTextareaProps };
