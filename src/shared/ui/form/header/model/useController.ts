import { useCallback } from 'react';

import { cn } from '~/shared/lib/utils';

import type { ControllerProps, ControllerResult } from './types';

// Constants
const VARIANTS = {
  default: {
    container: 'space-y-3 pb-6',
    flexLayout: 'flex items-start gap-4',
    iconSize: 'h-10 w-10',
    iconClasses: 'rounded-lg bg-primary/10 text-primary',
    titleSize: 'text-2xl',
    spacing: 'gap-4',
  },
  centered: {
    container: 'space-y-3 pb-6 text-center',
    flexLayout: 'flex flex-col items-center gap-4',
    iconSize: 'h-10 w-10',
    iconClasses: 'rounded-lg bg-primary/10 text-primary',
    titleSize: 'text-2xl',
    spacing: 'gap-4',
  },
  minimal: {
    container: 'space-y-3 pb-6',
    flexLayout: 'flex items-start gap-2',
    iconSize: 'h-6 w-6',
    iconClasses: '',
    titleSize: 'text-lg',
    spacing: 'gap-2',
  },
} as const;

/**
 * Hook for Header controller logic
 *
 * @param icon - Lucide icon component
 * @param avatar - Custom avatar element
 * @param variant - Layout variant
 *
 * @returns Controller result with layout helpers
 */
export const useController = ({
  icon,
  avatar,
  variant = 'default',
}: ControllerProps): ControllerResult => {
  const hasIcon = !!(icon || avatar);
  const isCentered = variant === 'centered';

  // Memoize functions to prevent unnecessary re-renders
  const getVariantClasses = useCallback(() => VARIANTS[variant], [variant]);

  const getIconClasses = useCallback(
    () =>
      cn(
        'flex items-center justify-center',
        VARIANTS[variant].iconSize,
        hasIcon && variant !== 'minimal' && VARIANTS[variant].iconClasses,
      ),
    [hasIcon, variant],
  );

  const getIconSize = useCallback(() => (variant === 'minimal' ? 'h-5 w-5' : 'h-6 w-6'), [variant]);

  const getDescriptionMargin = useCallback(() => {
    if (variant === 'centered') return 'ml-0';
    if (!hasIcon) return '';
    return variant === 'minimal' ? 'ml-8' : 'ml-14';
  }, [variant, hasIcon]);

  return {
    hasIcon,
    isCentered,
    getVariantClasses,
    getIconClasses,
    getIconSize,
    getDescriptionMargin,
  };
};
