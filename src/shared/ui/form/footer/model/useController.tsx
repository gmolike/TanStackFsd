// src/shared/ui/form/footer/model/useController.tsx
import { useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import { ArrowLeft, ArrowRight, Check, Loader2, RotateCcw } from 'lucide-react';

import type { ControllerProps, ControllerResult, FooterButton } from './types';

/**
 * Hook for Footer controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param form - React Hook Form instance (optional, will use context if not provided)
 * @param submit - Submit button configuration (presence shows button)
 * @param cancel - Cancel button configuration (presence shows button)
 * @param reset - Reset button configuration (presence shows button)
 * @param customActions - Custom buttons to add
 *
 * @returns Controller result with form state and all buttons
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  form: providedForm,
  submit,
  cancel,
  reset,
  customActions = [],
}: ControllerProps<TFieldValues>): ControllerResult => {
  // Always call useFormContext to comply with hooks rules
  const contextForm = useFormContext<TFieldValues>();
  const form = providedForm ?? contextForm;

  const { formState } = form;
  const { isSubmitting, isDirty, isSubmitted, isValid } = formState;

  const allButtons = useMemo(() => {
    const buttonsList: Array<FooterButton> = [];

    // Reset Button - shown if reset object is provided
    if (reset) {
      buttonsList.push({
        label: reset.label || 'Zurücksetzen',
        display: true,
        variant: reset.variant || 'outline',
        onClick: () => {
          form.reset();
          reset.onClick?.();
        },
        disabled: reset.disabled ?? (!isDirty || isSubmitting),
        icon: reset.icon || <RotateCcw className="h-4 w-4" />,
        type: 'button',
        className: reset.className,
      });
    }

    // Cancel Button - shown if cancel object is provided
    if (cancel) {
      buttonsList.push({
        label: cancel.label || 'Abbrechen',
        display: true,
        variant: cancel.variant || 'outline',
        onClick: cancel.onClick,
        disabled: cancel.disabled ?? isSubmitting,
        icon: cancel.icon || <ArrowLeft className="h-4 w-4" />,
        type: 'button',
        className: cancel.className,
      });
    }

    // Submit Button - shown if submit object is provided
    if (submit) {
      buttonsList.push({
        label: isSubmitting
          ? 'Wird gespeichert...'
          : isSubmitted && isValid
            ? 'Gespeichert'
            : submit.label || 'Speichern',
        display: true,
        variant: submit.variant || 'primary',
        type: 'submit',
        disabled: submit.disabled ?? isSubmitting,
        loading: isSubmitting,
        icon: isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSubmitted && isValid ? (
          <Check className="h-4 w-4" />
        ) : (
          submit.icon || <ArrowRight className="h-4 w-4" />
        ),
        onClick: submit.onClick,
        className: submit.className,
      });
    }

    // Add custom actions
    const visibleCustomActions = customActions.filter((action) => action.display !== false);

    return [...visibleCustomActions, ...buttonsList];
  }, [submit, cancel, reset, customActions, isSubmitting, isDirty, isSubmitted, isValid, form]);

  return {
    formState: { isSubmitting, isDirty, isSubmitted, isValid },
    allButtons,
  };
};
