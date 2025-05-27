import type { ReactElement } from 'react';
import type { Control, FieldPath, FieldValues, PathValue } from 'react-hook-form';

/**
 * Field render props from React Hook Form
 */
export type FieldRenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  onChange: (value: PathValue<TFieldValues, TName>) => void;
  onBlur: () => void;
  value: PathValue<TFieldValues, TName>;
  name: string;
  ref: React.Ref<HTMLElement>;
};

/**
 * Props for the FormFieldWrapper component
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * React Hook Form control object
   * Required to connect the field to the form
   */
  control: Control<TFieldValues>;

  /**
   * Field name in the form
   * Must be a valid path in TFieldValues (e.g., "email" or "address.street")
   */
  name: FieldPath<TFieldValues>;

  /**
   * Label text to display above the field
   * @optional If provided, renders a FormLabel component
   */
  label?: string;

  /**
   * Helper text to display below the field
   * @optional Provides additional context or instructions
   */
  description?: string;

  /**
   * Whether the field is required
   * @optional Adds required indicator to label and aria-required attribute
   */
  required?: boolean;

  /**
   * Additional CSS classes for the form item container
   * @optional Applied to the outermost FormItem element
   */
  className?: string;

  /**
   * Whether to show reset button
   * @default true
   * Button appears when field value differs from default
   */
  showReset?: boolean;

  /**
   * Render function for the field
   * Receives field props from React Hook Form
   * @param field - Field object with value, onChange, onBlur, etc.
   * @returns React element to render as the input
   */
  render: (field: FieldRenderProps<TFieldValues, FieldPath<TFieldValues>>) => ReactElement;
};

/**
 * Props for the FieldWrapper controller hook
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
   * Whether to show reset button
   */
  showReset?: boolean;
};

/**
 * Return value of the FieldWrapper controller hook
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * Whether the current value differs from default
   */
  isDifferentFromDefault: boolean;

  /**
   * Handle reset to default value
   */
  handleReset: () => void;

  /**
   * Current field value
   */
  currentValue: PathValue<TFieldValues, FieldPath<TFieldValues>>;
};
