import { useMemo } from 'react';

import { ArrowLeft, ArrowRight, Check, Loader2, RotateCcw } from 'lucide-react';

import { useForm } from '../..';

import type { ControllerProps, ControllerResult, FooterButton } from './types';

/**
 * Hook für Footer-Controller
 * @param buttons - Standard-Button-Konfiguration
 * @param customActions - Benutzerdefinierte Buttons
 * @returns Controller-Ergebnis mit Form-State und allen Buttons
 */
export const useController = ({
  buttons = {},
  customActions = [],
}: ControllerProps): ControllerResult => {
  const form = useForm();
  const { formState } = form;
  const { isSubmitting, isDirty, isSubmitted, isValid } = formState;

  const allButtons = useMemo(() => {
    const buttonsList: Array<FooterButton> = [];

    // Reset Button
    if (buttons.reset?.display) {
      buttonsList.push({
        label: buttons.reset.label || 'Zurücksetzen',
        display: true,
        variant: buttons.reset.variant || 'outline',
        onClick: () => {
          form.reset();
          buttons.reset?.onClick?.();
        },
        disabled: buttons.reset.disabled ?? (!isDirty || isSubmitting),
        icon: buttons.reset.icon || <RotateCcw className="h-4 w-4" />,
        type: buttons.reset.type || 'button',
        className: buttons.reset.className,
      });
    }

    // Cancel Button
    if (buttons.cancel?.display) {
      buttonsList.push({
        label: buttons.cancel.label || 'Abbrechen',
        display: true,
        variant: buttons.cancel.variant || 'outline',
        onClick: buttons.cancel.onClick,
        disabled: buttons.cancel.disabled ?? isSubmitting,
        icon: buttons.cancel.icon || <ArrowLeft className="h-4 w-4" />,
        type: buttons.cancel.type || 'button',
        className: buttons.cancel.className,
      });
    }

    // Submit Button (immer anzeigen, wenn nicht explizit deaktiviert)
    if (buttons.submit?.display !== false) {
      buttonsList.push({
        label: isSubmitting
          ? 'Wird gespeichert...'
          : isSubmitted && isValid
            ? 'Gespeichert'
            : buttons.submit?.label || 'Speichern',
        display: true,
        variant: buttons.submit?.variant || 'primary',
        type: buttons.submit?.type || 'submit',
        disabled: buttons.submit?.disabled ?? isSubmitting,
        loading: buttons.submit?.loading ?? isSubmitting,
        icon: isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSubmitted && isValid ? (
          <Check className="h-4 w-4" />
        ) : (
          buttons.submit?.icon || <ArrowRight className="h-4 w-4" />
        ),
        onClick: buttons.submit?.onClick,
        className: buttons.submit?.className,
      });
    }

    // Custom Actions hinzufügen
    const visibleCustomActions = customActions.filter((action) => action.display !== false);

    return [...visibleCustomActions, ...buttonsList];
  }, [buttons, customActions, isSubmitting, isDirty, isSubmitted, isValid, form]);

  return {
    formState: { isSubmitting, isDirty, isSubmitted, isValid },
    allButtons,
  };
};
