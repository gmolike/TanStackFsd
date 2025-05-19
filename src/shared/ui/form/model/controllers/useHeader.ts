import { useMemo } from 'react';
import type { ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

// Constants
const HEADER_VARIANTS = {
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

type HeaderVariant = keyof typeof HEADER_VARIANTS;

type Props = {
  title: string;
  description?: string | ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
  avatar?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  variant?: HeaderVariant;
};

type Result = {
  hasIcon: boolean;
  isCentered: boolean;
  variantClasses: (typeof HEADER_VARIANTS)[HeaderVariant];
  iconClasses: string;
  iconSize: string;
  descriptionMargin: string;
};

export const useHeader = ({ icon, avatar, variant = 'default' }: Props): Result => {
  const hasIcon = !!(icon || avatar);
  const isCentered = variant === 'centered';

  const variantClasses = HEADER_VARIANTS[variant];

  const iconClasses = cn(
    'flex items-center justify-center',
    variantClasses.iconSize,
    hasIcon && variant !== 'minimal' && variantClasses.iconClasses,
  );

  const iconSize = variant === 'minimal' ? 'h-5 w-5' : 'h-6 w-6';

  const descriptionMargin = useMemo(() => {
    if (variant === 'centered') return 'ml-0';
    if (!hasIcon) return '';
    return variant === 'minimal' ? 'ml-8' : 'ml-14';
  }, [variant, hasIcon]);

  return {
    hasIcon,
    isCentered,
    variantClasses,
    iconClasses,
    iconSize,
    descriptionMargin,
  };
};
