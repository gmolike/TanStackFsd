import { cn } from '~/shared/lib/utils';

import { Skeleton } from '.';

export type CardProps = {
  rows?: number;
  columns?: number;
  isLoading?: boolean;
  className?: string;
};

/**
 * Skeleton Card component using ShadCN UI
 * Perfect for product cards, content cards, dashboard widgets, etc.
 */
export const Card = ({ rows = 1, columns = 1, isLoading = true, className }: CardProps) => {
  if (!isLoading) return null;

  return (
    <div
      className={cn('grid gap-4', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: rows * columns }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-40 w-full rounded-md" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
};
