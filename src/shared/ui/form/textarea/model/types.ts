// src/shared/ui/form/textarea/model/types.ts - REFACTORED IN THIS CHAT
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
   * Determines the initial height of the textarea
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
   * Required to access form state
   */
  control: Control<TFieldValues>;

  /**
   * Field name in the form
   * Used to access field state and errors
   */
  name: FieldPath<TFieldValues>;

  /**
   * Whether the textarea is disabled
   * @optional Combined with form submission state
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   * @optional Used for aria-required attribute
   */
  required?: boolean;

  /**
   * Number of rows
   * @optional Passed through to the textarea element
   */
  rows?: number;
};

/**
 * Return value of the TextArea controller hook
 */
export type ControllerResult = {
  /**
   * Whether the textarea is disabled (considering form state)
   * True if explicitly disabled or form is submitting
   */
  isDisabled: boolean;

  /**
   * Number of rows to display
   * Value from props or default (3)
   */
  rows: number;

  /**
   * ARIA props for accessibility
   */
  ariaProps: {
    /**
     * Whether the field has validation errors
     */
    'aria-invalid': boolean;

    /**
     * Whether the field is required
     */
    'aria-required': boolean;

    /**
     * Whether the field is disabled
     */
    'aria-disabled': boolean;
  };
};
