import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import type { BaseFieldProps } from '../../input/model/types';

/**
 * Option for Select dropdown
 */
export type Option = {
  /**
   * The value that will be submitted
   */
  value: string;

  /**
   * The label displayed to the user
   */
  label: string;

  /**
   * Whether this option is disabled
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
   */
  options: Array<Option>;

  /**
   * Text for an empty/null option (e.g., "None selected")
   * If provided, adds an empty option at the beginning
   */
  emptyOption?: string;
};

/**
 * Props for the Select controller hook
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
   * Whether the select is disabled
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Array of options
   */
  options: Array<Option>;

  /**
   * Text for empty option
   */
  emptyOption?: string;
};

/**
 * Return value of the Select controller hook
 */
export type ControllerResult = {
  /**
   * Whether the select is disabled (considering form state)
   */
  isDisabled: boolean;

  /**
   * Whether to show an empty option
   */
  hasEmptyOption: boolean;

  /**
   * Processed options array
   */
  selectOptions: Array<Option>;

  /**
   * Text for the empty option
   */
  emptyOptionText: string;
};
