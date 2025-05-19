import type { ReactNode } from 'react';

// Definiere alle erlaubten Varianten explizit
export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'link';
export type ButtonType = 'button' | 'submit' | 'reset';

export type Action = {
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  type?: ButtonType;
  className?: string;
};

export type ControllerProps = {
  submitText?: string;
  cancelText?: string;
  resetText?: string;
  showCancel?: boolean;
  showReset?: boolean;
  onCancel?: () => void;
  onReset?: () => void;
  actions?: Array<Action>;
};

export type ControllerResult = {
  formState: {
    isSubmitting: boolean;
    isDirty: boolean;
    isSubmitted: boolean;
    isValid: boolean;
  };
  defaultActions: Array<Action>;
  allActions: Array<Action>;
};

export type Props = ControllerProps & {
  links?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
  errors?: Array<string>;
  successMessage?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'split' | 'centered';
  sticky?: boolean;
};
