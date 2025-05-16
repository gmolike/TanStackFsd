import { memo } from 'react';
import type { JSX } from 'react';
import type { FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { ChevronDown } from 'lucide-react';

import { FormField } from './Context';
import type { BaseFieldProps } from './Field';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './Form';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type FormSelectProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    options: Array<SelectOption>;
    emptyOption?: string;
  };

type SelectProps<TFieldValues extends FieldValues = FieldValues> = FormSelectProps<TFieldValues>;

/**
 * Ein natives Select-Dropdown mit automatischer Validierung.
 * Optimiert für React 19 Performance.
 */
export const FormSelect = memo(
  <TFieldValues extends FieldValues = FieldValues>({
    name,
    label,
    description,
    required,
    placeholder = 'Auswählen...',
    disabled,
    className,
    options,
    emptyOption,
  }: SelectProps<TFieldValues>) => (
    <FormField name={name}>
      <Controller
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className}>
            {label && <FormLabel required={required}>{label}</FormLabel>}
            <FormControl>
              <div className="relative">
                <select
                  disabled={disabled}
                  className={`flex h-10 w-full cursor-pointer appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''} `}
                  {...field}
                >
                  {(emptyOption || placeholder) && (
                    <option value="" disabled={!emptyOption}>
                      {emptyOption || placeholder}
                    </option>
                  )}
                  {options.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 opacity-50" />
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          </FormItem>
        )}
      />
    </FormField>
  ),
) as <TFieldValues extends FieldValues = FieldValues>(
  props: SelectProps<TFieldValues>,
) => JSX.Element;

FormSelect.displayName = 'FormSelect';

// Checkbox Field Component
type FormCheckboxProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
  };

type CheckboxProps<TFieldValues extends FieldValues = FieldValues> =
  FormCheckboxProps<TFieldValues>;

/**
 * Eine native Checkbox mit automatischer Validierung.
 * Optimiert für React 19 Performance.
 */
export const FormCheckbox = memo(
  <TFieldValues extends FieldValues = FieldValues>({
    name,
    label,
    description,
    required,
    disabled,
    className,
    side = 'right',
  }: CheckboxProps<TFieldValues>) => (
    <FormField name={name}>
      <Controller
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className}>
            <div
              className={`flex items-center space-x-2 ${side === 'left' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <FormControl>
                <input
                  type="checkbox"
                  id={field.name}
                  disabled={disabled}
                  checked={field.value}
                  onChange={field.onChange}
                  className={`h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${fieldState.error ? 'border-destructive focus:ring-destructive' : ''} `}
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
  ),
) as <TFieldValues extends FieldValues = FieldValues>(
  props: CheckboxProps<TFieldValues>,
) => JSX.Element;

FormCheckbox.displayName = 'FormCheckbox';

export type { FormCheckboxProps, FormSelectProps, SelectOption };
