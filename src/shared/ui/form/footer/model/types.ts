import type { ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

/**
 * Button variants for footer buttons
 */
export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'link';

/**
 * Button types for HTML form elements
 */
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Configuration for a single footer button
 */
export type FooterButton = {
  /**
   * Button label text
   */
  label: string;

  /**
   * Whether to display this button
   */
  display: boolean;

  /**
   * Click handler for the button
   */
  onClick?: () => void;

  /**
   * Visual variant of the button
   */
  variant?: ButtonVariant;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Whether the button is in loading state
   */
  loading?: boolean;

  /**
   * Icon element to display in the button
   */
  icon?: ReactNode;

  /**
   * HTML button type
   */
  type?: ButtonType;

  /**
   * Additional CSS classes
   */
  className?: string;
};

/**
 * Configuration for standard buttons (presence of object shows button)
 */
export type StandardButtonConfig = {
  /**
   * Button label text
   * @default Automatic based on button type
   */
  label?: string;

  /**
   * Click handler for the button
   */
  onClick?: () => void;

  /**
   * Visual variant of the button
   * @default Based on button type
   */
  variant?: ButtonVariant;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Icon element to display in the button
   * @default Automatic based on button type
   */
  icon?: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
};

/**
 * Props for the footer controller hook
 *
 * @template TFieldValues - Type of the form values
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * React Hook Form instance
   */
  form?: UseFormReturn<TFieldValues>;

  /**
   * Submit button configuration (presence shows button)
   */
  submit?: StandardButtonConfig;

  /**
   * Cancel button configuration (presence shows button)
   */
  cancel?: StandardButtonConfig;

  /**
   * Reset button configuration (presence shows button)
   */
  reset?: StandardButtonConfig;

  /**
   * Additional custom buttons
   */
  customActions?: Array<FooterButton>;
};

/**
 * Return value of the footer controller hook
 */
export type ControllerResult = {
  /**
   * Current form state
   */
  formState: {
    isSubmitting: boolean;
    isDirty: boolean;
    isSubmitted: boolean;
    isValid: boolean;
  };

  /**
   * All buttons to display
   */
  allButtons: Array<FooterButton>;
};

/**
 * Footer component props
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> =
  ControllerProps<TFieldValues> & {
    /**
     * Array of footer links
     */
    links?: Array<{
      label: string;
      href: string;
      external?: boolean;
    }>;

    /**
     * Array of error messages to display
     */
    errors?: Array<string>;

    /**
     * Success message to display
     */
    successMessage?: string;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Layout variant
     * @default 'default'
     */
    variant?: 'default' | 'compact' | 'split' | 'centered';

    /**
     * Whether to stick footer to bottom
     * @default false
     */
    sticky?: boolean;
  };
