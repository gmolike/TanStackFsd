import type { ReactNode } from 'react';

export type FooterAction = {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'link';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

export interface FooterControllerProps {
  submitText?: string;
  cancelText?: string;
  resetText?: string;
  showCancel?: boolean;
  showReset?: boolean;
  onCancel?: () => void;
  onReset?: () => void;
  actions?: Array<FooterAction>;
}

export interface FooterControllerResult {
  formState: {
    isSubmitting: boolean;
    isDirty: boolean;
    isSubmitted: boolean;
    isValid: boolean;
  };
  defaultActions: Array<FooterAction>;
  allActions: Array<FooterAction>;
}

export interface FooterProps extends FooterControllerProps {
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
}

export interface StepsProps extends Omit<FooterProps, 'actions' | 'submitText'> {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  nextText?: string;
  previousText?: string;
  finishText?: string;
  skipText?: string;
  allowSkip?: boolean;
}
