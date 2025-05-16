import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import { Checkbox as ShadcnCheckbox } from '~/shared/shadcn/checkbox';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../Form';

import type { BaseFieldProps } from './types';

// Types
export type CheckboxProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
  };

/**
 * Checkbox - ShadCN Checkbox with automatic validation
 *
 * @param props.name - Unique field name for React Hook Form
 * @param props.label - Optional label text next to checkbox
 * @param props.description - Optional help text below checkbox
 * @param props.required - Shows asterisk (*) for required fields
 * @param props.disabled - Disables the checkbox
 * @param props.className - Additional CSS classes
 * @param props.side - Position of label relative to checkbox (default: "right")
 */
function CheckboxComponent<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  disabled,
  className,
}: CheckboxProps<TFieldValues>) {
  const form = useFormContext();

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
                disabled={disabled}
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
}

export const Checkbox = memo(CheckboxComponent);
