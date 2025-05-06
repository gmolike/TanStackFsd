import { cn } from '~/shared/lib/utils';

import { Skeleton } from '../skeleton';

export type CustomProps = {
  variant?: 'profile' | 'dashboard' | 'article';
  isLoading?: boolean;
  className?: string;
};

/**
 * Custom skeleton component with predefined layouts using ShadCN UI
 */
export const Custom = ({ variant = 'profile', isLoading = true, className }: CustomProps) => {
  if (!isLoading) return null;

  // Profile skeleton layout
  if (variant === 'profile') {
    return (
      <div className={cn('space-y-5', className)}>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>

        <Skeleton className="h-32 w-full rounded-md" />
      </div>
    );
  }

  // Dashboard widget skeleton layout
  if (variant === 'dashboard') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        <Skeleton className="h-40 w-full rounded-md" />

        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    );
  }

  // Article skeleton layout
  return (
    <div className={cn('space-y-6', className)}>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />

      <Skeleton className="h-64 w-full rounded-md" />

      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
};
