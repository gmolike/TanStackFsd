import type { FieldPath, FieldValues } from 'react-hook-form';

import type { Locale } from 'date-fns';

import type { BaseFieldProps } from '../../input/model/types';

// DateRange Component Props
export type Props<TFieldValues extends FieldValues = FieldValues> = Omit<
  BaseFieldProps<TFieldValues>,
  'name'
> & {
  startName: FieldPath<TFieldValues>; // Korrigiert zu FieldPath<TFieldValues>
  endName: FieldPath<TFieldValues>; // Korrigiert zu FieldPath<TFieldValues>
  startLabel?: string;
  endLabel?: string;
  dateFormat?: string;
  locale?: Locale;
};
