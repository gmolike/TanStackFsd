import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import type { LucideIcon } from 'lucide-react';

import type { BaseFieldProps } from '../../input/model/types';

/**
 * Display mode for the button content
 */
export type DisplayMode = 'value' | 'children' | 'formatted';

/**
 * Props for the DialogButton component
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Children to render in the button (when displayMode is 'children')
   * @optional Can be a ReactNode or a function that receives the current field value
   */
  children?: ReactNode | ((value: TFieldValues[keyof TFieldValues]) => ReactNode);

  /**
   * Display mode for the button content
   * @default 'value'
   * - 'value': Shows the raw field value
   * - 'children': Renders the children prop
   * - 'formatted': Uses the formatter function to display the value
   */
  displayMode?: DisplayMode;

  /**
   * Formatter function for the field value (when displayMode is 'formatted')
   * @optional Transforms the field value into a display string
   * @param value - The current field value
   * @returns Formatted string to display
   */
  formatter?: (value: TFieldValues[keyof TFieldValues]) => string;

  /**
   * Text to show when the field value is empty
   * @default 'Auswählen...'
   */
  emptyText?: string;

  /**
   * Button variant from ShadCN
   * @default 'outline'
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

  /**
   * Button size
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /**
   * Icon to display in the button
   * @optional Rendered on the left side of the button content
   */
  icon?: LucideIcon;

  /**
   * Icon to display on the right side
   * @optional Useful for indicating dialog will open (e.g., ChevronDown)
   */
  endIcon?: LucideIcon;

  /**
   * Dialog render function
   * @required Function that renders the dialog
   * Receives props for controlling dialog state and field value
   */
  dialog: (props: {
    /**
     * Whether the dialog is open
     */
    open: boolean;
    /**
     * Function to control dialog open state
     */
    onOpenChange: (open: boolean) => void;
    /**
     * Current field value (type-safe based on field name)
     */
    value: TFieldValues[keyof TFieldValues];
    /**
     * Function to update the field value
     */
    onChange: (value: TFieldValues[keyof TFieldValues]) => void;
    /**
     * Field name
     */
    name: FieldPath<TFieldValues>;
  }) => ReactNode;

  /**
   * Additional CSS classes for the button
   */
  buttonClassName?: string;

  /**
   * Whether the button should take full width
   * @default true
   */
  fullWidth?: boolean;
};

/**
 * Props for the DialogButton controller hook
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
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Display mode
   */
  displayMode?: DisplayMode;

  /**
   * Formatter function
   */
  formatter?: (value: TFieldValues[keyof TFieldValues]) => string;

  /**
   * Empty text
   */
  emptyText?: string;

  /**
   * Children prop
   */
  children?: ReactNode | ((value: TFieldValues[keyof TFieldValues]) => ReactNode);
};

/**
 * Return value of the DialogButton controller hook
 *
 * @template TFieldValues - Type of the form values
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * Whether the button is disabled (considering form state)
   */
  isDisabled: boolean;

  /**
   * Whether the dialog is open
   */
  dialogOpen: boolean;

  /**
   * Function to set dialog open state
   */
  setDialogOpen: (open: boolean) => void;

  /**
   * Handle button click
   */
  handleClick: () => void;

  /**
   * Get display content for the button
   * @param value - Current field value
   * @returns Content to display in the button
   */
  getDisplayContent: (value: TFieldValues[keyof TFieldValues]) => ReactNode;

  /**
   * Whether the field has a value
   * @param value - Current field value
   */
  hasValue: (value: TFieldValues[keyof TFieldValues]) => boolean;
};
