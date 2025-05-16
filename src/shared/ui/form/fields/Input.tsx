import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import { Input as ShadcnInput } from '~/shared/ui/input';

import { FormField, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../Form';

import type { BaseFieldProps } from './types';

// Types
export type InputProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
    autoComplete?: string;
  };

/**
 * Input - ShadCN Input field with automatic validation
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
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <ShadcnInput
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const Input = memo(InputComponent);
