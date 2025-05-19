import { memo } from 'react';

import { Footer } from '../footer';

import type { StepsProps } from './model/types';
import { useController } from './model/useController';

const FooterStepsComponent = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  nextText,
  previousText,
  finishText,
  skipText,
  allowSkip,
  ...props
}: StepsProps) => {
  const { stepsActions } = useController({
    currentStep,
    totalSteps,
    onNext,
    onPrevious,
    onSkip,
    nextText,
    previousText,
    finishText,
    skipText,
    allowSkip,
  });

  return <Footer {...props} actions={stepsActions} showCancel={false} showReset={false} />;
};

export const Component = memo(FooterStepsComponent);
