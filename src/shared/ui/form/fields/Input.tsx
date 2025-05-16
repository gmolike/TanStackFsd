import { memo } from 'react';
import type { ChangeEvent } from 'react';
import type { FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { FormField } from '../Context';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../Form';

import type { BaseFieldProps } from './types';

// Types
export type InputProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
    autoComplete?: string;
  };

// Constants
const INPUT_CLASSES = `
  flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
  ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
`.trim();

// Utility Functions
const getErrorClasses = (hasError: boolean) =>
  hasError ? 'border-destructive focus-visible:ring-destructive' : '';

const createChangeHandler =
  (type: string, onChange: (value: string | number) => void) =>
  (e: ChangeEvent<HTMLInputElement>) => {
    const value = type === 'number' ? e.target.valueAsNumber : e.target.value;
    onChange(value);
  };

/**
 * Input - Type-safe input field with automatic validation
 *
 * @param props.name - Unique field name for React Hook Form
 * @param props.label - Optional label text above input
 * @param props.description - Optional help text below input
 * @param props.required - Shows asterisk (*) for required fields
 * @param props.disabled - Disables the input field
 * @param props.placeholder - Placeholder text
 * @param props.className - Additional CSS classes
 * @param props.type - HTML input type
 * @param props.autoComplete - Browser autocomplete attribute
 */
function InputComponent<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  type = 'text',
  placeholder,
  autoComplete,
  disabled,
  className,
}: InputProps<TFieldValues>) {
  return (
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
                className={`${INPUT_CLASSES} ${getErrorClasses(!!fieldState.error)}`}
                {...field}
                onChange={createChangeHandler(type, field.onChange)}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          </FormItem>
        )}
      />
    </FormField>
  );
}

export const Input = memo(InputComponent);
