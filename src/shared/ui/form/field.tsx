import { memo } from 'react';
import type { ChangeEvent, JSX } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { FormField } from './Context';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './Form';

// Types
type BaseFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type FormInputProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
    autoComplete?: string;
  };

type FormTextareaProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    rows?: number;
  };

// Constants
const INPUT_CLASSES = `
  flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
  ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
`.trim();

const TEXTAREA_CLASSES = `
  flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm
  ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50
`.trim();

// Utility Functions
const getErrorClasses = (hasError: boolean) =>
  hasError ? 'border-destructive focus-visible:ring-destructive' : '';

const createChangeHandler =
  (type: string, onChange: (value: unknown) => void) =>
  (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value =
      type === 'number' && 'valueAsNumber' in e.target
        ? (e.target as HTMLInputElement).valueAsNumber
        : e.target.value;
    onChange(value);
  };

/**
 * FormInput - Type-safe input field with automatic validation
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

export const FormInput = memo(
  <TFieldValues extends FieldValues = FieldValues>({
    name,
    label,
    description,
    required,
    type = 'text',
    placeholder,
    autoComplete,
    disabled,
    className,
  }: FormInputProps<TFieldValues>) => (
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
  ),
) as <TFieldValues extends FieldValues = FieldValues>(
  props: FormInputProps<TFieldValues>,
) => JSX.Element;

FormInput.displayName = 'FormInput';

/**
 * FormTextarea - Multi-line textarea field with automatic validation
 *
 * @param props.name - Unique field name for React Hook Form
 * @param props.label - Optional label text above textarea
 * @param props.description - Optional help text below textarea
 * @param props.required - Shows asterisk (*) for required fields
 * @param props.disabled - Disables the textarea field
 * @param props.placeholder - Placeholder text
 * @param props.className - Additional CSS classes
 * @param props.rows - Number of visible text lines (default: 3)
 */
export const FormTextarea = memo(
  <TFieldValues extends FieldValues = FieldValues>({
    name,
    label,
    description,
    required,
    placeholder,
    disabled,
    className,
    rows = 3,
  }: FormTextareaProps<TFieldValues>) => (
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
                className={`${TEXTAREA_CLASSES} ${getErrorClasses(!!fieldState.error)}`}
                {...field}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          </FormItem>
        )}
      />
    </FormField>
  ),
) as <TFieldValues extends FieldValues = FieldValues>(
  props: FormTextareaProps<TFieldValues>,
) => JSX.Element;

FormTextarea.displayName = 'FormTextarea';

// Exports
export type { BaseFieldProps, FormInputProps, FormTextareaProps, SelectOption };
