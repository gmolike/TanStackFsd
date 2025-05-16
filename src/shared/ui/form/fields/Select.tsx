import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { ChevronDown } from 'lucide-react';

import { FormField } from '../Context';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../Form';

import type { BaseFieldProps, SelectOption } from './types';

// Types
export type SelectProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    options: Array<SelectOption>;
    emptyOption?: string;
  };

// Constants
const SELECT_CLASSES = `
  flex h-10 w-full cursor-pointer appearance-none rounded-md border border-input
  bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50
`.trim();

// Utility Functions
const getErrorClasses = (hasError: boolean) =>
  hasError ? 'border-destructive focus-visible:ring-destructive' : '';

/**
 * Select - Native select dropdown with automatic validation
 *
 * @param props.name - Unique field name for React Hook Form
 * @param props.label - Optional label text above select
 * @param props.description - Optional help text below select
 * @param props.required - Shows asterisk (*) for required fields
 * @param props.disabled - Disables the select field
 * @param props.placeholder - Placeholder text (default: "Auswählen...")
 * @param props.className - Additional CSS classes
 * @param props.options - Array of options with value and label
 * @param props.emptyOption - Optional text for empty option
 */
function SelectComponent<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder = 'Auswählen...',
  disabled,
  className,
  options,
  emptyOption,
}: SelectProps<TFieldValues>) {
  return (
    <FormField name={name}>
      <Controller
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className}>
            {label && <FormLabel required={required}>{label}</FormLabel>}
            <FormControl>
              <div className="relative">
                <select
                  disabled={disabled}
                  className={`${SELECT_CLASSES} ${getErrorClasses(!!fieldState.error)}`}
                  {...field}
                >
                  {(emptyOption || placeholder) && (
                    <option value="" disabled={!emptyOption}>
                      {emptyOption || placeholder}
                    </option>
                  )}
                  {options.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 opacity-50" />
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          </FormItem>
        )}
      />
    </FormField>
  );
}

export const Select = memo(SelectComponent);
