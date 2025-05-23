import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import type { Locale } from 'date-fns';

import type { BaseFieldProps } from '../../input/model/types';

/**
 * Props for the DatePicker component
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Date format string (using date-fns format)
   * @default 'dd.MM.yyyy'
   */
  dateFormat?: string;

  /**
   * Whether to show time selection (not implemented in current version)
   */
  showTime?: boolean;

  /**
   * Minimum allowed date
   */
  min?: Date;

  /**
   * Maximum allowed date
   */
  max?: Date;

  /**
   * Locale for date formatting
   * @default de (German)
   */
  locale?: Locale;
};

/**
 * Props for the DatePicker controller hook
 *
 * @template TFieldValues - Type of the form values
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * React Hook Form control object
   */
  control: Control<TFieldValues>;

  /**
   * Field name in the form
   */
  name: FieldPath<TFieldValues>;

  /**
   * Whether the date picker is disabled
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Date format string
   */
  dateFormat?: string;

  /**
   * Minimum date
   */
  min?: Date;

  /**
   * Maximum date
   */
  max?: Date;

  /**
   * Locale
   */
  locale?: Locale;
};

/**
 * Return value of the DatePicker controller hook
 */
export type ControllerResult = {
  /**
   * Whether the date picker is disabled (considering form state)
   */
  isDisabled: boolean;

  /**
   * Formatted date value for display
   */
  formattedValue: string;

  /**
   * Function to format a date
   */
  formatDate: (date: Date | string | null) => string;

  /**
   * Function to check if a date should be disabled
   */
  isDateDisabled: (date: Date) => boolean;
};
