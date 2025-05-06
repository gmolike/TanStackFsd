import { cn } from '~/shared/lib/utils';

import { Skeleton } from '../skeleton';

export type TableProps = {
  rows?: number;
  columns?: number;
  isLoading?: boolean;
  className?: string;
};

/**
 * Skeleton Table component using ShadCN UI
 * Perfect for data tables, spreadsheets, or any tabular data
 */
export const Table = ({ rows = 5, columns = 4, isLoading = true, className }: TableProps) => {
  if (!isLoading) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Table Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} className="h-8 w-full" />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-6 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
};
