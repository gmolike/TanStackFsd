import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import type { BaseFieldProps } from '../../input/model/types';

/**
 * Label position relative to the checkbox
 */
export type LabelSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * Props for the Checkbox component
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Position of the label relative to the checkbox
   * @default 'right'
   */
  side?: LabelSide;
};

/**
 * Props for the Checkbox controller hook
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
   * Whether the checkbox is disabled
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Label position
   */
  side?: LabelSide;
};

/**
 * Return value of the Checkbox controller hook
 */
export type ControllerResult = {
  /**
   * Whether the checkbox is disabled (considering form state)
   */
  isDisabled: boolean;

  /**
   * CSS classes for the label/checkbox group layout
   */
  groupClasses: string;
};
