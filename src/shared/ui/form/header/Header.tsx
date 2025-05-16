// src/shared/ui/form/header/Header.tsx
import { memo } from 'react';
import type { ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

// Types
type HeaderProps = {
  title: string;
  description?: string | ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
  avatar?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  variant?: 'default' | 'centered' | 'minimal';
};

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

// Utility Functions
const getVariantClasses = (variant: keyof typeof HEADER_VARIANTS) => HEADER_VARIANTS[variant];

const getIconClasses = (variant: keyof typeof HEADER_VARIANTS, hasIcon: boolean) => {
  const variantClasses = getVariantClasses(variant);
  return cn(
    'flex items-center justify-center',
    variantClasses.iconSize,
    hasIcon && variant !== 'minimal' && variantClasses.iconClasses,
  );
};

const getIconSize = (variant: keyof typeof HEADER_VARIANTS) =>
  variant === 'minimal' ? 'h-5 w-5' : 'h-6 w-6';

const getDescriptionMargin = (variant: keyof typeof HEADER_VARIANTS, hasIcon: boolean) => {
  if (variant === 'centered') return 'ml-0';
  if (!hasIcon) return '';
  return variant === 'minimal' ? 'ml-8' : 'ml-14';
};

/**
 * HeaderComponent - Flexible header for forms with configurable layout
 */
const HeaderComponent = ({
  title,
  description,
  subtitle,
  icon: Icon,
  avatar,
  badge,
  actions,
  className,
  titleClassName,
  descriptionClassName,
  variant = 'default',
}: HeaderProps) => {
  const variantClasses = getVariantClasses(variant);
  const hasIcon = !!(Icon || avatar);
  const isCentered = variant === 'centered';

  return (
    <div className={cn(variantClasses.container, className)}>
      {/* Header with Icon/Avatar and Actions */}
      <div className={cn(variantClasses.flexLayout)}>
        {/* Icon or Avatar */}
        {hasIcon && (
          <div className={getIconClasses(variant, !!Icon)}>
            {Icon && <Icon className={getIconSize(variant)} />}
            {avatar && avatar}
          </div>
        )}

        {/* Title and Actions Container */}
        <div className={cn('flex-1', isCentered && 'w-full')}>
          <div className={cn('flex items-start justify-between', isCentered && 'flex-col gap-2')}>
            {/* Title and Badge */}
            <div className={cn('space-y-1', isCentered && 'flex flex-col items-center')}>
              <div className="flex items-center gap-2">
                <h1
                  className={cn(
                    'font-semibold tracking-tight',
                    variantClasses.titleSize,
                    titleClassName,
                  )}
                >
                  {title}
                </h1>
                {badge && badge}
              </div>

              {subtitle && (
                <p
                  className={cn(
                    'text-sm font-medium text-muted-foreground',
                    isCentered && 'text-center',
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* Actions */}
            {actions && (
              <div className={cn('flex items-center gap-2', isCentered && 'w-full justify-center')}>
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className={getDescriptionMargin(variant, hasIcon)}>
          <div
            className={cn(
              'text-muted-foreground',
              variant === 'minimal' ? 'text-sm' : 'text-base',
              isCentered && 'text-center',
              descriptionClassName,
            )}
          >
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>
        </div>
      )}
    </div>
  );
};

export const Header = memo(HeaderComponent);
export type { HeaderProps };
