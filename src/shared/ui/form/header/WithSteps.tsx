import { memo } from 'react';

import type { HeaderProps } from './Header';
import { Header } from './Header';

// Types
export type WithStepsProps = Omit<HeaderProps, 'badge'> & {
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
};

/**
 * WithStepsComponent - Header with step indicator for multi-step forms
 */
const WithStepsComponent = ({
  currentStep,
  totalSteps,
  stepLabel = 'Schritt',
  ...props
}: WithStepsProps) => {
  const badge = (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
      {stepLabel} {currentStep} / {totalSteps}
    </span>
  );

  return <Header {...props} badge={badge} />;
};

export const WithSteps = memo(WithStepsComponent);
