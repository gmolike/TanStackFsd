import { cn } from '~/shared/lib/utils';

import { Skeleton } from '.';

export type ListProps = {
  rows?: number;
  columns?: number;
  isLoading?: boolean;
  className?: string;
};

/**
 * Skeleton List component using ShadCN UI
 * Perfect for user lists, comment lists, notification lists, etc.
 */
export const List = ({ rows = 3, columns = 1, isLoading = true, className }: ListProps) => {
  if (!isLoading) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[160px]" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
