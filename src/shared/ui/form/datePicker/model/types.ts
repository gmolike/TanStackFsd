// src/shared/ui/form/datePicker/model/types.ts - REFACTORED IN THIS CHAT
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
   * @see https://date-fns.org/docs/format
   */
  dateFormat?: string;

  /**
   * Whether to show time selection (not implemented in current version)
   * @optional Reserved for future time picker functionality
   */
  showTime?: boolean;

  /**
   * Minimum allowed date
   * @optional Dates before this will be disabled in the calendar
   */
  min?: Date;

  /**
   * Maximum allowed date
   * @optional Dates after this will be disabled in the calendar
   */
  max?: Date;

  /**
   * Locale for date formatting
   * @default de (German)
   * @optional Used for month names, day names, and date formatting
   */
  locale?: Locale;

  /**
   * Whether to show clear button
   * @default true
   * Button appears when a date is selected
   */
  showClear?: boolean;
};

/**
 * Props for the DatePicker controller hook
 *
 * @template TFieldValues - Type of the form values
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * React Hook Form control object
   * Required to access form state
   */
  control: Control<TFieldValues>;

  /**
   * Field name in the form
   * Used to access field state
   */
  name: FieldPath<TFieldValues>;

  /**
   * Whether the date picker is disabled
   * @optional Combined with form submission state
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   * @optional Used for aria-required attribute
   */
  required?: boolean;

  /**
   * Date format string
   * @optional Used to format the displayed date
   */
  dateFormat?: string;

  /**
   * Minimum date
   * @optional Used to disable dates in calendar
   */
  min?: Date;

  /**
   * Maximum date
   * @optional Used to disable dates in calendar
   */
  max?: Date;

  /**
   * Locale
   * @optional Used for date formatting
   */
  locale?: Locale;
};

/**
 * Return value of the DatePicker controller hook
 */
export type ControllerResult = {
  /**
   * Whether the date picker is disabled (considering form state)
   * True if explicitly disabled or form is submitting
   */
  isDisabled: boolean;

  /**
   * Formatted date value for display
   * Empty string if no date is selected
   */
  formattedValue: string;

  /**
   * Function to format a date
   * @param date - Date to format (Date object, ISO string, or null)
   * @returns Formatted date string or empty string
   */
  formatDate: (date: Date | string | null) => string;

  /**
   * Function to check if a date should be disabled
   * @param date - Date to check
   * @returns True if date should be disabled
   */
  isDateDisabled: (date: Date) => boolean;
};
