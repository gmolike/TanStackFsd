// src/shared/ui/form/fields/Input.tsx
import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { InputShadcn as ShadcnInput } from '~/shared/shadcn/input';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../Form';
import { useForm } from '../hook';

import type { BaseFieldProps } from './types';

// Types
export type InputProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
    autoComplete?: string;
  };

/**
 * InputComponent - ShadCN Input field with automatic validation
 */
const InputComponent = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  type = 'text',
  placeholder,
  autoComplete,
  disabled,
  className,
}: InputProps<TFieldValues>) => {
  const form = useForm<TFieldValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <ShadcnInput
              {...field}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled || form.formState.isSubmitting}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const Input = memo(InputComponent);
