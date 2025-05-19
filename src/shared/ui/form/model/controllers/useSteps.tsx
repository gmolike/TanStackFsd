import { useMemo } from 'react';

import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

import type { FooterAction } from '../types/footerTypes';

type Props = {
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
};

type Result = {
  isFirst: boolean;
  isLast: boolean;
  stepsActions: Array<FooterAction>;
};

export const useSteps = ({
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
}: Props): Result => {
  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;

  const stepsActions = useMemo(() => {
    const actions: Array<FooterAction> = [];

    // Skip button
    if (allowSkip && !isLast) {
      actions.push({
        label: skipText,
        variant: 'link',
        onClick: onSkip,
      });
    }

    // Previous button
    if (!isFirst) {
      actions.push({
        label: previousText,
        variant: 'outline',
        onClick: onPrevious,
        icon: <ArrowLeft className="h-4 w-4" />,
      });
    }

    // Next/Finish button
    actions.push({
      label: isLast ? finishText : nextText,
      variant: 'primary',
      onClick: isLast ? undefined : onNext,
      type: isLast ? 'submit' : 'button',
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
