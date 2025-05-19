import { memo } from 'react';

import { useStepsController } from '../../model/controllers';
import type { StepsProps } from '../../model/types/footerTypes';

import { Footer } from './Footer';

const StepsComponent = ({
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
  const { stepsActions } = useStepsController({
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

export const Steps = memo(StepsComponent);
