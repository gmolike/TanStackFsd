import type { Action, Props as FooterProps } from '../../footer/model/types';

// Definiere alle erlaubten Varianten explizit
export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'link';

export type StepsProps = Omit<FooterProps, 'actions' | 'submitText'> & {
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

export type ControllerProps = {
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

export type ControllerResult = {
  isFirst: boolean;
  isLast: boolean;
  stepsActions: Array<Action>; // Verwende den Action-Typ aus footer/model/types
};
