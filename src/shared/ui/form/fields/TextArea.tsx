import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import { Textarea as ShadcnTextarea } from '~/shared/shadcn/textarea';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../Form';

import type { BaseFieldProps } from './types';

// Types
export type TextAreaProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    rows?: number;
  };

/**
 * Textarea - ShadCN Textarea field with automatic validation
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
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <ShadcnTextarea placeholder={placeholder} disabled={disabled} rows={rows} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const TextArea = memo(TextAreaComponent);
