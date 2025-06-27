import type { Control, FieldPath, FieldValues } from 'react-hook-form';

/**
 * Props for the DateRange component
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * React Hook Form control object
   */
  control: Control<TFieldValues>;

  /**
   * Field name for the start date
   */
  startName: FieldPath<TFieldValues>;

  /**
   * Field name for the end date
   */
  endName: FieldPath<TFieldValues>;

  /**
   * Main label for the date range
   */
  label?: string;

  /**
   * Label for the start date picker
   * @default 'Von'
   */
  startLabel?: string;

  /**
   * Label for the end date picker
   * @default 'Bis'
   */
  endLabel?: string;

  /**
   * Helper text to display below the date range
   */
  description?: string;

  /**
   * Whether both fields are required
   */
  required?: boolean;

  /**
   * Whether both date pickers are disabled
   */
  disabled?: boolean;

  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * Date format string for both pickers
   */
  dateFormat?: string;
};
