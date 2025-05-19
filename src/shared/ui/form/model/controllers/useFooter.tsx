import { useMemo } from 'react';

import { ArrowLeft, ArrowRight, Check, Loader2, RotateCcw } from 'lucide-react';

import { useForm } from '../hooks';
import type { FooterAction } from '../types/footerTypes';

type Props = {
  submitText?: string;
  cancelText?: string;
  resetText?: string;
  showCancel?: boolean;
  showReset?: boolean;
  onCancel?: () => void;
  onReset?: () => void;
  actions?: Array<FooterAction>;
};

type Result = {
  formState: {
    isSubmitting: boolean;
    isDirty: boolean;
    isSubmitted: boolean;
    isValid: boolean;
  };
  defaultActions: Array<FooterAction>;
  allActions: Array<FooterAction>;
};

export const useFooter = ({
  submitText = 'Speichern',
  cancelText = 'Abbrechen',
  resetText = 'Zurücksetzen',
  showCancel = true,
  showReset = false,
  onCancel,
  onReset,
  actions = [],
}: Props): Result => {
  const form = useForm();
  const { formState } = form;
  const { isSubmitting, isDirty, isSubmitted, isValid } = formState;

  const defaultActions = useMemo(() => {
    const buttonActions: Array<FooterAction> = [];

    // Reset button
    if (showReset) {
      buttonActions.push({
        label: resetText,
        variant: 'outline',
        onClick: () => {
          form.reset();
          onReset?.();
        },
        disabled: !isDirty || isSubmitting,
        icon: <RotateCcw className="h-4 w-4" />,
        type: 'button',
      });
    }

    // Cancel button
    if (showCancel) {
      buttonActions.push({
        label: cancelText,
        variant: 'outline',
        onClick: onCancel,
        disabled: isSubmitting,
        icon: <ArrowLeft className="h-4 w-4" />,
        type: 'button',
      });
    }

    // Submit button
    buttonActions.push({
      label: isSubmitting
        ? 'Wird gespeichert...'
        : isSubmitted && isValid
          ? 'Gespeichert'
          : submitText,
      variant: 'primary',
      type: 'submit',
      disabled: isSubmitting,
      loading: isSubmitting,
      icon: isSubmitting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSubmitted && isValid ? (
        <Check className="h-4 w-4" />
      ) : (
        <ArrowRight className="h-4 w-4" />
      ),
    });

    return buttonActions;
  }, [
    showReset,
    resetText,
    onReset,
    showCancel,
    cancelText,
    onCancel,
    submitText,
    isSubmitting,
    isDirty,
    isSubmitted,
    isValid,
    form,
  ]);

  return {
    formState: { isSubmitting, isDirty, isSubmitted, isValid },
    defaultActions,
    allActions: [...actions, ...defaultActions],
  };
};
