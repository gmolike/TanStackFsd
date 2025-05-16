import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { FormField } from '../Context';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../Form';

import type { BaseFieldProps } from './types';

// Types
export type CheckboxProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
  };

// Constants
const CHECKBOX_CLASSES = `
  h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2
  focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
`.trim();

// Utility Functions
const getErrorClasses = (hasError: boolean) =>
  hasError ? 'border-destructive focus-visible:ring-destructive' : '';

const getSideClasses = (side: string) =>
  side === 'left' ? 'flex-row-reverse space-x-reverse' : '';

/**
 * Checkbox - Native checkbox with automatic validation
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
  side = 'right',
}: CheckboxProps<TFieldValues>) {
  return (
    <FormField name={name}>
      <Controller
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className}>
            <div className={`flex items-center space-x-2 ${getSideClasses(side)}`}>
              <FormControl>
                <input
                  type="checkbox"
                  id={field.name}
                  disabled={disabled}
                  checked={field.value}
                  onChange={field.onChange}
                  className={`${CHECKBOX_CLASSES} ${getErrorClasses(!!fieldState.error)}`}
                />
              </FormControl>
              {label && (
                <FormLabel htmlFor={field.name} required={required} className="cursor-pointer">
                  {label}
                </FormLabel>
              )}
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          </FormItem>
        )}
      />
    </FormField>
  );
}

export const Checkbox = memo(CheckboxComponent);
