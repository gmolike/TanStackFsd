import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import type { BaseFieldProps } from '../../input/model/types';

// TextArea Component Props
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  rows?: number;
};

// Controller Props and Result
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = Pick<
  Props<TFieldValues>,
  'disabled' | 'required' | 'rows'
> & {
  name: FieldPath<TFieldValues>;
};

// Import UseFormReturn von react-hook-form für korrekte Typisierung
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>; // Korrigiert von any zu UseFormReturn<TFieldValues>
  isDisabled: boolean;
  rows: number;
  ariaProps: {
    'aria-invalid': boolean;
    'aria-required': boolean;
    'aria-disabled': boolean;
  };
};
