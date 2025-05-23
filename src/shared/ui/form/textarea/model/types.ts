import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import type { BaseFieldProps } from '../../input/model/types';

/**
 * Props for the TextArea component
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Number of visible text rows
   * @default 3
   */
  rows?: number;
};

/**
 * Props for the TextArea controller hook
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
   * Whether the textarea is disabled
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Number of rows
   */
  rows?: number;
};

/**
 * Return value of the TextArea controller hook
 */
export type ControllerResult = {
  /**
   * Whether the textarea is disabled (considering form state)
   */
  isDisabled: boolean;

  /**
   * Number of rows to display
   */
  rows: number;

  /**
   * ARIA props for accessibility
   */
  ariaProps: {
    'aria-invalid': boolean;
    'aria-required': boolean;
    'aria-disabled': boolean;
  };
};
