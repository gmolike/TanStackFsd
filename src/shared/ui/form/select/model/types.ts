import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import type { BaseFieldProps } from '../../input/model/types';

// Select option type for dropdown fields
export type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

// Select Component Props
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  options: Array<Option>;
  emptyOption?: string;
};

// Controller Props and Result
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  options: Array<Option>;
  emptyOption?: string;
};

export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>; // Korrigiert zu UseFormReturn<TFieldValues>
  isDisabled: boolean;
  hasEmptyOption: boolean;
  options: Array<Option>;
  emptyOption?: string;
};
