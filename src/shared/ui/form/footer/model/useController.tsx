import { useMemo } from 'react';

import { ArrowLeft, ArrowRight, Check, Loader2, RotateCcw } from 'lucide-react';

import { useForm } from '../..';

import type { Action, ControllerProps, ControllerResult } from './types';

export const useController = ({
  submitText = 'Speichern',
  cancelText = 'Abbrechen',
  resetText = 'Zurücksetzen',
  showCancel = true,
  showReset = false,
  onCancel,
  onReset,
  actions = [],
}: ControllerProps): ControllerResult => {
  const form = useForm();
  const { formState } = form;
  const { isSubmitting, isDirty, isSubmitted, isValid } = formState;

  const defaultActions = useMemo(() => {
    const buttonActions: Array<Action> = [];

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
