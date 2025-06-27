import type { Control, FieldPath, FieldValues, PathValue } from 'react-hook-form';

import type { EnumConfigBundle } from '~/shared/ui/enum';

import type { BaseFieldProps } from '../../input/model/types';

export type EnumOption = {
  value: string;
  label: string;
};

export type Props<
  TFieldValues extends FieldValues = FieldValues,
  TEnum extends Record<string, string | number> = Record<string, string>,
> = BaseFieldProps<TFieldValues> & {
  /**
   * Enum configuration bundle
   */
  enumConfig: EnumConfigBundle<TEnum>;

  /**
   * Text for an empty/null option
   */
  emptyOption?: string;

  /**
   * Whether to show clear button
   * @default true
   */
  showClear?: boolean;
  /**
   * testId for testing
   */
  testId?: string;
};

export type ControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TEnum extends Record<string, string | number> = Record<string, string>,
> = {
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
   * Config of the enum to get all option
   * Passed through to the select component
   */
  enumConfig: EnumConfigBundle<TEnum>;
  /**
   * Text for empty option
   * @optional Creates an additional option with empty value
   */
  emptyOption?: string;
};

/**
 * Return value of the Select controller hook
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * Delete the select Value and set it to undefined
   */
  handleLocalReset: (onChange: () => void) => void;
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
   * enumbased Options to get all option
   * Passed through to the select component
   */
  enumOptions: Array<EnumOption>;
  /**
   * Text for the empty option
   * Value of emptyOption prop or empty string
   */
  emptyOptionText: string;
  normalizedValue: string;
  displayValue: string | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  /**
   * Checks if the field is undefined in the form and set is ihn this case to empty string
   */
  onValueChange: (
    value: string,
    onChange: (newValue: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void,
  ) => void;
};
