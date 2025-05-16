import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/shared/ui/select';

import { FormField, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../Form';

import type { BaseFieldProps, SelectOption } from './types';

// Types
export type SelectProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    options: Array<SelectOption>;
    emptyOption?: string;
  };

/**
 * Select - ShadCN Select dropdown with automatic validation
 *
 * @param props.name - Unique field name for React Hook Form
 * @param props.label - Optional label text above select
 * @param props.description - Optional help text below select
 * @param props.required - Shows asterisk (*) for required fields
 * @param props.disabled - Disables the select field
 * @param props.placeholder - Placeholder text (default: "Auswählen...")
 * @param props.className - Additional CSS classes
 * @param props.options - Array of options with value and label
 * @param props.emptyOption - Optional text for empty option
 */
function SelectComponent<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder = 'Auswählen...',
  disabled,
  className,
  options,
  emptyOption,
}: SelectProps<TFieldValues>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <ShadcnSelect onValueChange={field.onChange} value={field.value} disabled={disabled}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {emptyOption && <SelectItem value="">{emptyOption}</SelectItem>}
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </ShadcnSelect>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const Select = memo(SelectComponent);
