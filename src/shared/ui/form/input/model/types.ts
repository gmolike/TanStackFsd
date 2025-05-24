// src/shared/ui/form/input/model/types.ts - REFACTORED IN THIS CHAT
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import type { InputShadcn } from '~/shared/shadcn';

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
   * Required to connect the field to the form
   */
  control: Control<TFieldValues>;

  /**
   * Field name in the form (must be a valid path in TFieldValues)
   * Examples: "email", "address.street", "users[0].name"
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
   * Whether the field is required (overrides schema detection)
   * @optional If not provided, requirement is auto-detected from Zod schema
   */
  required?: boolean;

  /**
   * Whether the field is disabled
   * @optional Also disabled during form submission
   */
  disabled?: boolean;

  /**
   * Placeholder text for the field
   * @optional Shown when field is empty
   */
  placeholder?: string;

  /**
   * Additional CSS classes for the form item container
   * @optional Applied to the outermost FormItem element
   */
  className?: string;

  /**
   * Whether to show reset to default button
   * @default true
   * Button appears when field value differs from default
   */
  showReset?: boolean;
};

/**
 * Props for the Input component
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Icon component to display at the start of the input
   * @optional Renders inside the input field on the left
   */
  startIcon?: React.ReactNode;

  /**
   * Icon component to display at the end of the input
   * @optional Renders inside the input field on the right
   */
  endIcon?: React.ReactNode;

  /**
   * HTML input type (overrides schema detection)
   * @default 'text' or auto-detected from schema
   * @optional If not provided, type is auto-detected from Zod schema
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
   * Required to access form state and schema
   */
  control: Control<TFieldValues>;

  /**
   * Field name in the form
   * Used to extract field schema and state
   */
  name: FieldPath<TFieldValues>;

  /**
   * Whether the field is disabled
   * @optional Combined with form submission state
   */
  disabled?: boolean;

  /**
   * Whether the field is required (overrides schema detection)
   * @optional If not provided, extracted from Zod schema
   */
  required?: boolean;

  /**
   * HTML input type (overrides schema detection)
   * @optional If not provided, inferred from Zod schema
   */
  type?: InputHTMLType;
};

/**
 * Return value of the Input controller hook
 */
export type ControllerResult = {
  /**
   * Whether the field is disabled (considering form state)
   * True if explicitly disabled or form is submitting
   */
  isDisabled: boolean;

  /**
   * Whether the field is required (from schema or explicit)
   * Extracted from Zod schema or explicit prop
   */
  isRequired: boolean;

  /**
   * HTML input type (from schema or explicit)
   * Inferred from Zod schema (email, number, etc.) or explicit prop
   */
  inputType: InputHTMLType;

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
