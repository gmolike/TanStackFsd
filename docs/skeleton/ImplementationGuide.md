# Skeleton Components Implementation Guide

## Overview

This guide explains how to implement and use the ShadCN UI-based skeleton components in your Feature-Sliced Design (FSD) project. These components provide standardized loading states for various UI patterns with minimal configuration.

## Implementation Steps

1. **Create the Base Skeleton Component**

   - This component directly re-exports the ShadCN UI Skeleton component
   - Location: `src/shared/ui/skeleton/index.ts`

2. **Create Specialized Variants**

   - Implement variants for common UI patterns:
     - List skeletons
     - Card skeletons
     - Table skeletons
     - Custom specialized layouts

3. **Create a Hook for TanStack Query Integration**
   - Implement `useQueryWithSkeleton` hook for seamless integration

## File Structure

```
src/
└── shared/
    └── ui/
        └── skeleton/
            ├── index.ts                 // Exports all components
            ├── skeleton-card.tsx        // Card skeleton variant
            ├── skeleton-list.tsx        // List skeleton variant
            ├── skeleton-table.tsx       // Table skeleton variant
            └── skeleton-custom.tsx      // Custom layout variants
```

## Code Examples

### 1. Base Component Re-export (index.ts)

```typescript
// Re-export ShadCN UI Skeleton component
export { Skeleton } from '@/components/ui/skeleton';

// Export specific skeleton variants
export { SkeletonCard } from './skeleton-card';
export { SkeletonList } from './skeleton-list';
export { SkeletonTable } from './skeleton-table';
export { SkeletonCustom } from './skeleton-custom';

// Export types
export type { SkeletonCardProps } from './skeleton-card';
export type { SkeletonListProps } from './skeleton-list';
export type { SkeletonTableProps } from './skeleton-table';
export type { SkeletonCustomProps } from './skeleton-custom';
```

### 2. Skeleton List Component (skeleton-list.tsx)

```typescript
import React from 'react';
import { cn } from '~/shared/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export type SkeletonListProps = {
  rows?: number;
  columns?: number;
  isLoading?: boolean;
  className?: string;
};

export const SkeletonList = ({
  rows = 3,
  columns = 1,
  isLoading = true,
  className,
}: SkeletonListProps) => {
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
```

### 3. TanStack Query Hook Implementation

```typescript
import React from 'react';
import { useRemoteQuery } from '~/shared/api/query';
import type { UseRemoteQueryOptions } from '~/shared/api/query/types';
import { SkeletonCard, SkeletonList, SkeletonTable } from '~/shared/ui/skeleton';
import type { AxiosRequestConfig } from 'axios';

type SkeletonType = 'list' | 'card' | 'table' | 'none';

interface UseQueryWithSkeletonOptions<TData, TError> extends UseRemoteQueryOptions<TData, TError> {
  skeletonType?: SkeletonType;
  skeletonProps?: {
    rows?: number;
    columns?: number;
    className?: string;
  };
}

export function useQueryWithSkeleton<TData, TError = Error>(
  queryKey: unknown[],
  url: string,
  config?: AxiosRequestConfig,
  options?: UseQueryWithSkeletonOptions<TData, TError>
) {
  const {
    skeletonType = 'list',
    skeletonProps = { rows: 3, columns: 1 },
    ...queryOptions
  } = options || {};

  const query = useRemoteQuery<TData, TError>(queryKey, url, config, queryOptions);

  // Function to render the appropriate skeleton based on type
  const renderSkeleton = () => {
    if (skeletonType === 'none' || !query.isLoading) return null;

    const { rows = 3, columns = 1, className } = skeletonProps;

    switch (skeletonType) {
      case 'list':
        return <SkeletonList rows={rows} columns={columns} isLoading={true} className={className} />;
      case 'card':
        return <SkeletonCard rows={rows} columns={columns} isLoading={true} className={className} />;
      case 'table':
        return <SkeletonTable rows={rows} columns={columns} isLoading={true} className={className} />;
      default:
        return null;
    }
  };

  return {
    ...query,
    renderSkeleton,
  };
}
```

## Integration Example

Here's a practical example of using the skeleton components in a feature:

```tsx
// src/features/users/ui/user-list.tsx
import React from 'react';
import { useQueryWithSkeleton } from '~/shared/lib/hooks/use-query-with-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const UserList = () => {
  const { data, error, renderSkeleton } = useQueryWithSkeleton(['users'], '/api/users', undefined, {
    skeletonType: 'list',
    skeletonProps: { rows: 5 },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Skeleton is rendered during loading */}
        {renderSkeleton()}

        {/* Error handling */}
        {error && <div className="text-destructive">Error: {error.message}</div>}

        {/* Actual content when loaded */}
        {data && (
          <div className="space-y-4">
            {data.map((user) => (
              <div key={user.id} className="flex items-center space-x-4">
                <div className="bg-primary/10 h-12 w-12 rounded-full"></div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

## Extending with Custom Variants

To add custom skeleton variants for specific use cases:

1. Create a new file for your custom variant (e.g., `skeleton-dashboard.tsx`)
2. Implement the component using the ShadCN UI Skeleton component
3. Export it from the index.ts file

Example:

```typescript
// src/shared/ui/skeleton/skeleton-dashboard.tsx
import React from 'react';
import { cn } from '~/shared/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export type SkeletonDashboardProps = {
  isLoading?: boolean;
  className?: string;
};

export const SkeletonDashboard = ({
  isLoading = true,
  className,
}: SkeletonDashboardProps) => {
  if (!isLoading) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-3 gap-4">
        {/* Stats cards */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-md border p-4">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <Skeleton className="h-64 w-full rounded-md" />

      {/* Table */}
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`header-${index}`} className="h-8 w-full" />
          ))}
        </div>

        {Array.from({ length: 3 }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-6 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Conclusion

By implementing these skeleton components, you provide a consistent and elegant loading experience throughout your application. The modular structure lets you easily extend and customize the system to fit your specific UI patterns while maintaining the clean separation required by FSD architecture.
