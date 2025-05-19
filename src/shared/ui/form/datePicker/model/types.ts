import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import type { Locale } from 'date-fns';

import type { BaseFieldProps } from '../../input/model/types';

// DatePicker Component Props
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  dateFormat?: string;
  showTime?: boolean;
  min?: Date;
  max?: Date;
  locale?: Locale;
};

// Controller Props and Result
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  dateFormat?: string;
  min?: Date;
  max?: Date;
  locale?: Locale;
};

export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>; // Korrigiert zu UseFormReturn<TFieldValues>
  isDisabled: boolean;
  formattedValue: string;
  formatDate: (date: Date | string | null) => string;
  isDateDisabled: (date: Date) => boolean;
};
