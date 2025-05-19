import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import type { InputShadcn } from '~/shared/shadcn/input';

// Base field properties for consistent naming across components
export type BaseFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>; // Korrigiert von string zu FieldPath
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

// Input Component Props
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<typeof InputShadcn>, 'name'>;

// Controller Props and Result
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = Pick<
  Props<TFieldValues>,
  'disabled' | 'required' | 'startIcon' | 'endIcon'
> & {
  name: FieldPath<TFieldValues>; // Dies ist redundant, aber explizit für Klarheit
};

export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>; // Using any here to avoid circular import with form hooks
  isDisabled: boolean;
  hasIcons: boolean;
  startIconClasses: string;
  endIconClasses: string;
  inputClasses: string;
  ariaProps: {
    'aria-invalid'?: boolean;
    'aria-required'?: boolean;
    'aria-disabled'?: boolean;
  };
};
