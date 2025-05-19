import type { ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react';

export interface HeaderControllerProps {
  title: string;
  description?: string | ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
  avatar?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  variant?: 'default' | 'centered' | 'minimal';
}

export interface HeaderControllerResult {
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
}

export interface HeaderProps extends HeaderControllerProps {
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export interface WithStepsProps extends Omit<HeaderProps, 'badge'> {
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
}

export interface WithProgressProps extends HeaderProps {
  progress: number; // 0-100
  showPercentage?: boolean;
}
