import { memo } from 'react';

import { cn } from '~/shared/lib/utils';

import type { Props } from './model/types';
import { useController } from './model/useController';

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
}: Props) => {
  const {
    hasIcon,
    isCentered,
    getVariantClasses,
    getIconClasses,
    getIconSize,
    getDescriptionMargin,
  } = useController({
    title,
    description,
    subtitle,
    icon: Icon,
    avatar,
    badge,
    actions,
    variant,
  });

  const variantClasses = getVariantClasses();

  return (
    <div className={cn(variantClasses.container, className)}>
      {/* Header with Icon/Avatar and Actions */}
      <div className={cn(variantClasses.flexLayout)}>
        {/* Icon or Avatar */}
        {hasIcon && (
          <div className={getIconClasses()}>
            {Icon && <Icon className={getIconSize()} />}
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
        <div className={getDescriptionMargin()}>
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

export const Component = memo(HeaderComponent);
