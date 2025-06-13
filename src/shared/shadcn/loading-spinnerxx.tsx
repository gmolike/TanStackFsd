import { cn } from '~/shared/lib/utils';

/**
 * CSDoc: LoadingSpinner Component
 * @description A customizable loading spinner component with different sizes and styles
 * @param size - Size of the spinner: 'sm' | 'md' | 'lg' | 'xl'
 * @param className - Additional CSS classes to apply
 * @param variant - Visual variant: 'default' | 'primary' | 'secondary'
 * @example
 * ```tsx
 * <LoadingSpinner size="lg" variant="primary" />
 * ```
 */

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantClasses = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
};

export const LoadingSpinner = ({
  size = 'md',
  className,
  variant = 'default',
}: LoadingSpinnerProps) => {
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};
