// src/shared/ui/form/fieldWrapper/model/types.ts - CREATED IN THIS CHAT
import type { ReactElement } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

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
  render: (field: {
    onChange: (value: any) => void;
    onBlur: () => void;
    value: any;
    name: string;
    ref: React.Ref<any>;
  }) => ReactElement;
};
