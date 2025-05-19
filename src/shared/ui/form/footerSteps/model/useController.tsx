import { useMemo } from 'react';

import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

import type { Action } from '../../footer/model/types';

import type { ControllerProps, ControllerResult } from './types';

export const useController = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  nextText = 'Weiter',
  previousText = 'Zurück',
  finishText = 'Abschließen',
  skipText = 'Überspringen',
  allowSkip = false,
}: ControllerProps): ControllerResult => {
  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;

  const stepsActions = useMemo(() => {
    const actions: Array<Action> = [];

    // Skip button
    if (allowSkip && !isLast) {
      actions.push({
        label: skipText,
        variant: 'link', // Expliziter Wert, der mit ButtonVariant übereinstimmt
        onClick: onSkip,
      });
    }

    // Previous button
    if (!isFirst) {
      actions.push({
        label: previousText,
        variant: 'outline', // Expliziter Wert, der mit ButtonVariant übereinstimmt
        onClick: onPrevious,
        icon: <ArrowLeft className="h-4 w-4" />,
      });
    }

    // Next/Finish button
    actions.push({
      label: isLast ? finishText : nextText,
      variant: 'primary', // Expliziter Wert, der mit ButtonVariant übereinstimmt
      onClick: isLast ? undefined : onNext,
      type: isLast ? 'submit' : 'button', // Expliziter Wert, der mit ButtonType übereinstimmt
      icon: isLast ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />,
    });

    return actions;
  }, [
    isFirst,
    isLast,
    allowSkip,
    skipText,
    previousText,
    nextText,
    finishText,
    onNext,
    onPrevious,
    onSkip,
  ]);

  return {
    isFirst,
    isLast,
    stepsActions,
  };
};
