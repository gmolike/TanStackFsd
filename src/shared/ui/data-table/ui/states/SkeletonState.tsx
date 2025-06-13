import { Skeleton } from '~/shared/shadcn';

import { DEFAULT_SKELETON_ROWS } from '../../lib/constants';

interface SkeletonStateProps {
  rows?: number;
  columns?: number;
}

export const SkeletonState = ({
  rows = DEFAULT_SKELETON_ROWS,
  columns = 5,
}: SkeletonStateProps) => (
  <div className="space-y-3">
    {/* Header Skeleton */}
    <div className="flex gap-4 border-b bg-muted/50 p-3">
      {Array.from({ length: columns }, (_, i) => (
        <Skeleton key={`header-${i}`} className="h-4 w-24" />
      ))}
    </div>

    {/* Body Skeleton */}
    <div className="space-y-3 p-3">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }, (__, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-4"
              style={{ width: `${Math.floor(Math.random() * 60 + 40)}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);
