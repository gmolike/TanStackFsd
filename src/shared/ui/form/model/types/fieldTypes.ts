import type { ReactNode } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

import type { Locale } from 'date-fns';

import type { InputShadcn } from '~/shared/shadcn/input';

// Base field properties that all form fields share
export type BaseFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

// Select option type for dropdown fields
export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

// Input Component Props
export type InputProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    startIcon?: ReactNode;
    endIcon?: ReactNode;
  } & Omit<React.ComponentPropsWithoutRef<typeof InputShadcn>, 'name'>;

// TextArea Component Props
export type TextAreaProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    rows?: number;
  };

// Select Component Props
export type SelectProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    options: Array<SelectOption>;
    emptyOption?: string;
  };

// Checkbox Component Props
export type CheckboxProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
  };

// DatePicker Component Props
export type DatePickerProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    dateFormat?: string;
    showTime?: boolean;
    min?: Date;
    max?: Date;
    locale?: Locale;
  };

// DateRange Component Props (in fieldTypes.ts)
export type DateRangeProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  BaseFieldProps<TFieldValues>,
  'name'
> & {
  startName: FieldPath<TFieldValues>;
  endName: FieldPath<TFieldValues>;
  startLabel?: string;
  endLabel?: string;
  dateFormat?: string;
  locale?: Locale;
};
