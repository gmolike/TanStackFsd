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
 * WithSteps - Header with step indicator for multi-step forms
 *
 * @param props.currentStep - Current step (1-based)
 * @param props.totalSteps - Total number of steps
 * @param props.stepLabel - Label for step indicator (default: "Schritt")
 */
function WithStepsComponent({
  currentStep,
  totalSteps,
  stepLabel = 'Schritt',
  ...props
}: WithStepsProps) {
  const badge = (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
      {stepLabel} {currentStep} / {totalSteps}
    </span>
  );

  return <Header {...props} badge={badge} />;
}

export const WithSteps = memo(WithStepsComponent);
