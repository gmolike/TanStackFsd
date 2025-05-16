import type { FieldPath, FieldValues } from 'react-hook-form';

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
