import type { ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react';

/**
 * Props for the Header controller hook
 */
export type ControllerProps = {
  /**
   * Main title text (required)
   */
  title: string;

  /**
   * Description text or ReactNode
   */
  description?: string | ReactNode;

  /**
   * Additional subtitle text
   */
  subtitle?: string;

  /**
   * Lucide icon component
   */
  icon?: LucideIcon;

  /**
   * Custom avatar/image element
   */
  avatar?: ReactNode;

  /**
   * Badge element (e.g., status indicator)
   */
  badge?: ReactNode;

  /**
   * Action buttons to display on the right
   */
  actions?: ReactNode;

  /**
   * Layout variant
   * @default 'default'
   */
  variant?: 'default' | 'centered' | 'minimal';
};

/**
 * Return value of the Header controller hook
 */
export type ControllerResult = {
  /**
   * Whether an icon or avatar is present
   */
  hasIcon: boolean;

  /**
   * Whether the layout is centered
   */
  isCentered: boolean;

  /**
   * Get variant-specific CSS classes
   */
  getVariantClasses: () => {
    container: string;
    flexLayout: string;
    iconSize: string;
    iconClasses: string;
    titleSize: string;
    spacing: string;
  };

  /**
   * Get CSS classes for the icon container
   */
  getIconClasses: () => string;

  /**
   * Get icon size CSS classes
   */
  getIconSize: () => string;

  /**
   * Get margin for description based on layout
   */
  getDescriptionMargin: () => string;
};

/**
 * Props for the Header component
 */
export type Props = ControllerProps & {
  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * CSS classes for the title
   */
  titleClassName?: string;

  /**
   * CSS classes for the description
   */
  descriptionClassName?: string;
};

/**
 * Props for Header with steps indicator
 */
export type WithStepsProps = Omit<Props, 'badge'> & {
  /**
   * Current step number
   */
  currentStep: number;

  /**
   * Total number of steps
   */
  totalSteps: number;

  /**
   * Label prefix for steps
   * @default 'Step'
   */
  stepLabel?: string;
};

/**
 * Props for Header with progress bar
 */
export type WithProgressProps = Props & {
  /**
   * Progress percentage (0-100)
   */
  progress: number;

  /**
   * Whether to show percentage text
   * @default false
   */
  showPercentage?: boolean;
};
