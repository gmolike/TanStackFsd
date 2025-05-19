import type { ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react';

export type ControllerProps = {
  title: string;
  description?: string | ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
  avatar?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  variant?: 'default' | 'centered' | 'minimal';
};

export type ControllerResult = {
  hasIcon: boolean;
  isCentered: boolean;
  getVariantClasses: () => {
    container: string;
    flexLayout: string;
    iconSize: string;
    iconClasses: string;
    titleSize: string;
    spacing: string;
  };
  getIconClasses: () => string;
  getIconSize: () => string;
  getDescriptionMargin: () => string;
};

export type Props = ControllerProps & {
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export type WithStepsProps = Omit<Props, 'badge'> & {
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
};

export type WithProgressProps = Props & {
  progress: number; // 0-100
  showPercentage?: boolean;
};
