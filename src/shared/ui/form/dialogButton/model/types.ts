import type { ReactNode } from 'react';
import type { Control, FieldValues } from 'react-hook-form';

import type { LucideIcon } from 'lucide-react';

import type { BaseFieldProps } from '../../input/model/types';

/**
 * Props for the DialogButton component
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Children to render in the button
   * Can be a ReactNode or a function that receives the current field value
   */
  children: ReactNode | ((value: unknown) => ReactNode);

  /**
   * Additional content to display below the button
   * @optional Can be a ReactNode or a function that receives the current field value
   */
  additionalContent?: ReactNode | ((value: unknown) => ReactNode);

  /**
   * Text to show when the field value is empty (only used if children function returns empty)
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
   * The onChange function accepts any type to be compatible with React Hook Form
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
     * Current field value
     */
    value: unknown;
    /**
     * Function to update the field value
     * Uses 'any' for compatibility with React Hook Form's onChange
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (value: any) => void;
    /**
     * Field name
     */
    name: string;
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
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Empty text
   */
  emptyText?: string;

  /**
   * Children prop
   */
  children: ReactNode | ((value: unknown) => ReactNode);
};

/**
 * Return value of the DialogButton controller hook
 *
 * @template TFieldValues - Type of the form values
 */
export type ControllerResult = {
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
  getDisplayContent: (value: unknown) => ReactNode;

  /**
   * Whether the field has a value
   * @param value - Current field value
   */
  hasValue: (value: unknown) => boolean;
};
