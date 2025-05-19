import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import type { BaseFieldProps } from '../../input/model/types';

// Checkbox Component Props
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
};

// Controller Props und Result mit korrekter Typisierung
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
};

export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>; // Korrekt typisiert
  isDisabled: boolean;
  groupClasses: string;
};
