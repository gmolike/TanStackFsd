import { memo } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../shadcn';

interface FormNumberInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange?: (value: number | null) => void;
}

/**
 * FormNumberInput Component
 *
 * Ein Formular-Eingabefeld für Zahlen mit React Hook Form Integration.
 * Unterstützt null-Werte für optionale Felder.
 *
 * @example
 * ```tsx
 * <FormNumberInput
 *   control={form.control}
 *   name="capacity"
 *   label="Kapazität"
 *   placeholder="z.B. 5000"
 *   min={0}
 *   description="Lager- oder Bürofläche"
 * />
 * ```
 */
const Component = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
  min,
  max,
  step,
  disabled = false,
  onChange,
}: FormNumberInputProps<TFieldValues, TName>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>
          {label} {required && <span className="text-destructive">*</span>}
        </FormLabel>
        <FormControl>
          <input
            type="number"
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            value={field.value ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                field.onChange(null);
                onChange?.(null);
              } else {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                  field.onChange(numValue);
                  onChange?.(numValue);
                }
              }
            }}
            onBlur={field.onBlur}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

export const NumberInput = memo(Component) as typeof Component;
