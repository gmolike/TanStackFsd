// src/shared/ui/form/fields/TextArea.tsx
import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { Textarea as ShadcnTextarea } from '~/shared/shadcn/textarea';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../Form';
import { useForm } from '../hook';

import type { BaseFieldProps } from './types';

// Types
export type TextAreaProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    rows?: number;
  };

/**
 * TextAreaComponent - ShadCN Textarea field with automatic validation
 */
const TextAreaComponent = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder,
  disabled,
  className,
  rows = 3,
}: TextAreaProps<TFieldValues>) => {
  const form = useForm<TFieldValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <ShadcnTextarea
              {...field}
              placeholder={placeholder}
              disabled={disabled || form.formState.isSubmitting}
              rows={rows}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const TextArea = memo(TextAreaComponent);
