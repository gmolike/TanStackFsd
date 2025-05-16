import { memo } from 'react';
import type { ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

export type FormHeaderProps = {
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

/**
 * Ein flexibler Header für Formulare mit konfigurierbarem Layout.
 * Optimiert für React 19 Performance.
 */
export const FormHeader = memo<FormHeaderProps>(
  ({
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
  }) => {
    const isMinimal = variant === 'minimal';
    const isCentered = variant === 'centered';

    return (
      <div className={cn('space-y-3 pb-6', isCentered && 'text-center', className)}>
        {/* Header with Icon/Avatar and Actions */}
        <div
          className={cn(
            'flex items-start gap-4',
            isCentered && 'flex-col items-center',
            isMinimal && 'gap-2',
          )}
        >
          {/* Icon or Avatar */}
          {(Icon || avatar) && (
            <div
              className={cn(
                'flex items-center justify-center',
                isMinimal ? 'h-6 w-6' : 'h-10 w-10',
                Icon && !isMinimal && 'rounded-lg bg-primary/10 text-primary',
              )}
            >
              {Icon && <Icon className={cn(isMinimal ? 'h-5 w-5' : 'h-6 w-6')} />}
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
                      isMinimal ? 'text-lg' : 'text-2xl',
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
                <div
                  className={cn('flex items-center gap-2', isCentered && 'w-full justify-center')}
                >
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div
            className={cn(
              Icon || avatar ? (isMinimal ? 'ml-8' : 'ml-14') : '',
              isCentered && 'ml-0',
            )}
          >
            <div
              className={cn(
                'text-muted-foreground',
                isMinimal ? 'text-sm' : 'text-base',
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
  },
);

FormHeader.displayName = 'FormHeader';

// Pre-styled variants
export const FormHeaderMinimal = memo<Omit<FormHeaderProps, 'variant'>>((props) => (
  <FormHeader {...props} variant="minimal" />
));
FormHeaderMinimal.displayName = 'FormHeaderMinimal';

export const FormHeaderCentered = memo<Omit<FormHeaderProps, 'variant'>>((props) => (
  <FormHeader {...props} variant="centered" />
));
FormHeaderCentered.displayName = 'FormHeaderCentered';

// Header with common patterns
export interface FormHeaderWithStepsProps extends Omit<FormHeaderProps, 'badge'> {
  currentStep: number;
  totalSteps: number;
  stepLabel?: string;
}

/**
 * Header mit Schritt-Anzeige für mehrstufige Formulare.
 * Optimiert für React 19.
 */
export const FormHeaderWithSteps = memo<FormHeaderWithStepsProps>(
  ({ currentStep, totalSteps, stepLabel = 'Schritt', ...props }) => {
    const badge = (
      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
        {stepLabel} {currentStep} / {totalSteps}
      </span>
    );

    return <FormHeader {...props} badge={badge} />;
  },
);

FormHeaderWithSteps.displayName = 'FormHeaderWithSteps';

// Header with progress indicator
export interface FormHeaderWithProgressProps extends FormHeaderProps {
  progress: number; // 0-100
  showPercentage?: boolean;
}

/**
 * Header mit Fortschrittsbalken für Upload- oder mehrstufige Formulare.
 * Optimiert für React 19.
 */
export const FormHeaderWithProgress = memo<FormHeaderWithProgressProps>(
  ({ progress, showPercentage = false, description, ...props }) => {
    const progressElement = (
      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Fortschritt</span>
          {showPercentage && <span className="font-medium">{Math.round(progress)}%</span>}
        </div>
        <div className="h-2 w-full rounded-full bg-secondary">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>
    );

    const enhancedDescription = description ? (
      <div className="space-y-3">
        {typeof description === 'string' ? <p>{description}</p> : description}
        {progressElement}
      </div>
    ) : (
      progressElement
    );

    return (
      <FormHeader {...props} description={enhancedDescription} descriptionClassName="space-y-3" />
    );
  },
);

FormHeaderWithProgress.displayName = 'FormHeaderWithProgress';
