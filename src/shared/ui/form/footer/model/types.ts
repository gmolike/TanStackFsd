// src/shared/ui/form/footer/model/types.ts
import type { FieldValues, UseFormReturn } from 'react-hook-form';

/**
 * Props for the Footer component with error/success handling
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * React Hook Form instance
   * @optional Will use context if not provided
   */
  form?: UseFormReturn<TFieldValues>;

  /**
   * Submit handler (form submission is handled automatically)
   * @optional Called when form is submitted
   */
  onSubmit?: () => void;

  /**
   * Cancel handler
   * @optional Called when cancel button is clicked
   */
  onCancel?: () => void;

  /**
   * Reset handler (called after form reset)
   * @optional Called after form.reset() is executed
   */
  onReset?: () => void;

  /**
   * Whether to show reset button
   * @default false
   */
  showReset?: boolean;

  /**
   * Whether to show cancel button
   * @default false
   */
  showCancel?: boolean;

  /**
   * Text for submit button
   * @default 'Speichern'
   */
  submitText?: string;

  /**
   * Text for cancel button
   * @default 'Abbrechen'
   */
  cancelText?: string;

  /**
   * Text for reset button
   * @default 'Zurücksetzen'
   */
  resetText?: string;

  /**
   * Error message to display
   * @optional Shows error alert when provided
   */
  error?: string;

  /**
   * Success message to display
   * @optional Shows success alert when provided
   */
  success?: string;

  /**
   * Additional CSS classes for the footer container
   */
  className?: string;

  /**
   * Children content to display on the left side
   * @optional Shows custom content on the left while buttons stay on the right
   */
  children?: React.ReactNode;
};

/**
 * Props for the footer controller hook
 *
 * @template TFieldValues - Type of the form values
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * React Hook Form instance
   * @optional Will use context if not provided
   */
  form?: UseFormReturn<TFieldValues>;

  /**
   * Reset handler
   * @optional Called after form.reset() is executed
   */
  onReset?: () => void;
  /**
   * Cancel handler
   */
  onCancel?: () => void;
};

/**
 * Return value of the footer controller hook
 */
export type ControllerResult = {
  /**
   * Current form state
   */
  formState: {
    /**
     * Whether the form is currently submitting
     */
    isSubmitting: boolean;

    /**
     * Whether any form field has been modified
     */
    isDirty: boolean;

    /**
     * Whether all form validations pass
     */
    isValid: boolean;
  };

  /**
   * Handle reset with callback
   * Resets form to default values and calls onReset callback
   */
  handleReset: () => void;
  /**
   * Handle Cancel with callback
   * Resets form to default values and calls onCancel callback
   */
  handleCancel: () => void;
};
