import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { FormField } from '../Context';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../Form';

import type { BaseFieldProps } from './types';

// Types
export type TextAreaProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    rows?: number;
  };

// Constants
const TEXTAREA_CLASSES = `
  flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm
  ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50
`.trim();

// Utility Functions
const getErrorClasses = (hasError: boolean) =>
  hasError ? 'border-destructive focus-visible:ring-destructive' : '';

/**
 * Textarea - Multi-line textarea field with automatic validation
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
function TextAreaComponent<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder,
  disabled,
  className,
  rows = 3,
}: TextAreaProps<TFieldValues>) {
  return (
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
  );
}

export const TextArea = memo(TextAreaComponent);
