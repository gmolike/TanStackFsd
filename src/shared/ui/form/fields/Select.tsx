// src/shared/ui/form/fields/Select.tsx
import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/shared/shadcn/select';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../Form';
import { useForm } from '../hook';

import type { BaseFieldProps, SelectOption } from './types';

// Types
export type SelectProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    options: Array<SelectOption>;
    emptyOption?: string;
  };

/**
 * SelectComponent - ShadCN Select dropdown with automatic validation
 */
const SelectComponent = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder = 'Auswählen...',
  disabled,
  className,
  options,
  emptyOption,
}: SelectProps<TFieldValues>) => {
  const form = useForm<TFieldValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <ShadcnSelect
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled || form.formState.isSubmitting}
          >
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
};

export const Select = memo(SelectComponent);
