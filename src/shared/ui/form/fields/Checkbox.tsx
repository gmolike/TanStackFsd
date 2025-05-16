// src/shared/ui/form/fields/Checkbox.tsx
import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { Checkbox as ShadcnCheckbox } from '~/shared/shadcn/checkbox';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../Form';
import { useForm } from '../hook';

import type { BaseFieldProps } from './types';

// Types
export type CheckboxProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
  };

/**
 * CheckboxComponent - ShadCN Checkbox with automatic validation
 */
const CheckboxComponent = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  disabled,
  className,
}: CheckboxProps<TFieldValues>) => {
  const form = useForm<TFieldValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center space-x-2">
            <FormControl>
              <ShadcnCheckbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled || form.formState.isSubmitting}
              />
            </FormControl>
            {label && (
              <FormLabel required={required} className="cursor-pointer">
                {label}
              </FormLabel>
            )}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const Checkbox = memo(CheckboxComponent);
