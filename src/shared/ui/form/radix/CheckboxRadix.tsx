import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Check } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

import { FormField } from '../Context';
import type { BaseFieldProps } from '../fields/types';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../Form';

// Types
type CheckboxRadixProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues>;

// Constants
const CHECKBOX_CLASSES = `
  peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50
  data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground
`.trim();

// Utility Functions
const getErrorClasses = (hasError: boolean) => (hasError ? 'border-destructive' : '');

/**
 * CheckboxRadix - Enhanced checkbox with Radix UI for better accessibility
 *
 * @param props.name - Unique field name for React Hook Form
 * @param props.label - Optional label text next to checkbox
 * @param props.description - Optional help text below checkbox
 * @param props.required - Shows asterisk (*) for required fields
 * @param props.disabled - Disables the checkbox
 * @param props.className - Additional CSS classes
 */
function CheckboxRadixComponent<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  disabled,
  className,
}: CheckboxRadixProps<TFieldValues>) {
  return (
    <FormField name={name}>
      <Controller
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className}>
            <div className="flex items-center space-x-2">
              <FormControl>
                <CheckboxPrimitive.Root
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                  className={cn(CHECKBOX_CLASSES, getErrorClasses(!!fieldState.error))}
                >
                  <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
                    <Check className="h-4 w-4" />
                  </CheckboxPrimitive.Indicator>
                </CheckboxPrimitive.Root>
              </FormControl>
              {label && (
                <LabelPrimitive.Root htmlFor={field.name} asChild>
                  <FormLabel required={required} className="cursor-pointer">
                    {label}
                  </FormLabel>
                </LabelPrimitive.Root>
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

export const CheckboxRadix = memo(CheckboxRadixComponent);
export type { CheckboxRadixProps };
