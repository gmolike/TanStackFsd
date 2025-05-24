// src/shared/ui/form/select/model/types.ts - REFACTORED IN THIS CHAT
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import type { BaseFieldProps } from '../../input/model/types';

/**
 * Option for Select dropdown
 */
export type Option = {
  /**
   * The value that will be submitted
   * Used as the form field value when this option is selected
   */
  value: string;

  /**
   * The label displayed to the user
   * Shown in the dropdown list and when selected
   */
  label: string;

  /**
   * Whether this option is disabled
   * @optional Prevents selection of this option
   */
  disabled?: boolean;
};

/**
 * Props for the Select component
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Array of options to display in the dropdown
   * Each option must have a unique value
   */
  options: Array<Option>;

  /**
   * Text for an empty/null option (e.g., "None selected")
   * @optional If provided, adds an empty option at the beginning
   */
  emptyOption?: string;

  /**
   * Whether to show clear button
   * @default true
   * Button appears when an option is selected
   */
  showClear?: boolean;
};

/**
 * Props for the Select controller hook
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
   * Whether the select is disabled
   * @optional Combined with form submission state
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   * @optional Used for aria-required attribute
   */
  required?: boolean;

  /**
   * Array of options
   * Passed through to the select component
   */
  options: Array<Option>;

  /**
   * Text for empty option
   * @optional Creates an additional option with empty value
   */
  emptyOption?: string;
};

/**
 * Return value of the Select controller hook
 */
export type ControllerResult = {
  /**
   * Whether the select is disabled (considering form state)
   * True if explicitly disabled or form is submitting
   */
  isDisabled: boolean;

  /**
   * Whether to show an empty option
   * True if emptyOption prop is provided
   */
  hasEmptyOption: boolean;

  /**
   * Processed options array
   * Same as input options (for future processing)
   */
  selectOptions: Array<Option>;

  /**
   * Text for the empty option
   * Value of emptyOption prop or empty string
   */
  emptyOptionText: string;
};
