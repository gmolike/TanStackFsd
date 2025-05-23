import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import type { InputShadcn } from '~/shared/shadcn/input';

/**
 * Supported HTML input types
 */
export type InputHTMLType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week';

/**
 * Base field props shared by all form fields
 *
 * @template TFieldValues - Type of the form values
 */
export type BaseFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * React Hook Form control object
   */
  control: Control<TFieldValues>;

  /**
   * Field name in the form (must be a valid path in TFieldValues)
   */
  name: FieldPath<TFieldValues>;

  /**
   * Label text to display above the field
   */
  label?: string;

  /**
   * Helper text to display below the field
   */
  description?: string;

  /**
   * Whether the field is required (overrides schema detection)
   */
  required?: boolean;

  /**
   * Whether the field is disabled
   */
  disabled?: boolean;

  /**
   * Placeholder text for the field
   */
  placeholder?: string;

  /**
   * Additional CSS classes for the form item container
   */
  className?: string;
};

/**
 * Props for the Input component
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Icon component to display at the start of the input
   */
  startIcon?: React.ReactNode;

  /**
   * Icon component to display at the end of the input
   */
  endIcon?: React.ReactNode;

  /**
   * HTML input type (overrides schema detection)
   * @default 'text' or auto-detected from schema
   */
  type?: InputHTMLType;
} & Omit<React.ComponentPropsWithoutRef<typeof InputShadcn>, 'name' | 'type' | 'required'>;

/**
 * Props for the Input controller hook
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
   * Whether the field is disabled
   */
  disabled?: boolean;

  /**
   * Whether the field is required (overrides schema detection)
   */
  required?: boolean;

  /**
   * HTML input type (overrides schema detection)
   */
  type?: InputHTMLType;
};

/**
 * Return value of the Input controller hook
 */
export type ControllerResult = {
  /**
   * Whether the field is disabled (considering form state)
   */
  isDisabled: boolean;

  /**
   * Whether the field is required (from schema or explicit)
   */
  isRequired: boolean;

  /**
   * HTML input type (from schema or explicit)
   */
  inputType: InputHTMLType;

  /**
   * ARIA props for accessibility
   */
  ariaProps: {
    'aria-invalid': boolean;
    'aria-required': boolean;
    'aria-disabled': boolean;
  };
};
