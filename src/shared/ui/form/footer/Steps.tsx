import { memo } from 'react';

import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

import type { FooterAction, FooterProps } from './Footer';
import { Footer } from './Footer';

type StepsProps = Omit<FooterProps, 'actions' | 'submitText'> & {
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

/**
 * StepsComponent - Special footer for multi-step forms with automatic navigation
 */
const StepsComponent = ({
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
  ...props
}: StepsProps) => {
  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;

  const actions: Array<FooterAction> = [
    ...(allowSkip && !isLast
      ? [
          {
            label: skipText,
            variant: 'link' as const,
            onClick: onSkip,
          },
        ]
      : []),
    ...(isFirst
      ? []
      : [
          {
            label: previousText,
            variant: 'outline' as const,
            onClick: onPrevious,
            icon: <ArrowLeft className="h-4 w-4" />,
          },
        ]),
    {
      label: isLast ? finishText : nextText,
      variant: 'primary' as const,
      onClick: isLast ? undefined : onNext,
      type: isLast ? 'submit' : 'button',
      icon: isLast ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />,
    },
  ];

  return <Footer {...props} actions={actions} showCancel={false} showReset={false} />;
};

export const Steps = memo(StepsComponent);
export type { StepsProps };
