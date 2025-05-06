# Skeleton Components Usage Guide

## Introduction

This document provides guidance on using the skeleton components built with ShadCN UI for the Feature-Sliced Design (FSD) architecture. These components create standardized loading states for common UI patterns, helping to improve user experience during data fetching.

## Available Components

Our skeleton system offers five main components:

1. **Skeleton** - The base component from ShadCN UI
2. **SkeletonList** - For list-like layouts such as user lists
3. **SkeletonCard** - For card-like layouts such as product grids
4. **SkeletonTable** - For table-like layouts such as data tables
5. **SkeletonCustom** - For specialized layouts with preset variants

## Basic Usage

### Import

```tsx
import {
  Skeleton,
  SkeletonList,
  SkeletonCard,
  SkeletonTable,
  SkeletonCustom,
} from '~/shared/ui/skeleton';
```

### Simple Example

```tsx
// Basic Skeleton
<Skeleton className="h-4 w-32" />

// List Skeleton
<SkeletonList rows={3} isLoading={true} />

// Card Skeleton
<SkeletonCard rows={1} columns={3} isLoading={true} />

// Table Skeleton
<SkeletonTable rows={5} columns={4} isLoading={true} />

// Custom Skeleton
<SkeletonCustom variant="profile" isLoading={true} />
```

## Integration with TanStack Query

The components are designed to work seamlessly with TanStack Query:

```tsx
import { useRemoteQuery } from '~/shared/api/query';
import { SkeletonList } from '~/shared/ui/skeleton';

const UsersList = () => {
  const { data, isLoading } = useRemoteQuery(['users'], '/api/users');

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Users</h2>

      {/* Show skeleton while loading */}
      <SkeletonList rows={5} isLoading={isLoading} />

      {/* Show actual content when loaded */}
      {!isLoading && data && (
        <ul className="space-y-4">
          {data.map((user) => (
            <li key={user.id} className="flex items-center space-x-4">
              <div className="bg-primary/10 h-12 w-12 rounded-full"></div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

You can also use the included `useQueryWithSkeleton` hook for even simpler integration:

```tsx
import { useQueryWithSkeleton } from '~/shared/lib/hooks/use-query-with-skeleton';

const ProductGrid = () => {
  const { data, error, renderSkeleton } = useQueryWithSkeleton(
    ['products'],
    '/api/products',
    undefined,
    {
      skeletonType: 'card',
      skeletonProps: { rows: 2, columns: 3 },
    },
  );

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Products</h2>

      {/* Render skeleton while loading */}
      {renderSkeleton()}

      {/* Handle error state */}
      {error && <div className="text-destructive">Error: {error.message}</div>}

      {/* Render actual content when loaded */}
      {data && (
        <div className="grid grid-cols-3 gap-4">
          {data.map((product) => (
            <div key={product.id} className="flex flex-col space-y-3">
              <div className="bg-muted h-40 rounded-md"></div>
              <h4 className="text-lg font-medium">{product.name}</h4>
              <p className="text-muted-foreground text-sm">{product.description}</p>
              <p className="font-bold">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Component API

### Base Skeleton

```tsx
<Skeleton className="h-4 w-40" />
```

Props:

- `className`: Additional CSS classes

### SkeletonList

```tsx
<SkeletonList rows={3} columns={1} isLoading={true} className="my-4" />
```

Props:

- `rows`: Number of list items (default: 3)
- `columns`: Number of columns in the grid (default: 1)
- `isLoading`: Whether to show the skeleton (default: true)
- `className`: Additional CSS classes

### SkeletonCard

```tsx
<SkeletonCard rows={1} columns={3} isLoading={true} className="my-4" />
```

Props:

- `rows`: Number of rows in the grid (default: 1)
- `columns`: Number of columns in the grid (default: 1)
- `isLoading`: Whether to show the skeleton (default: true)
- `className`: Additional CSS classes

### SkeletonTable

```tsx
<SkeletonTable rows={5} columns={4} isLoading={true} className="my-4" />
```

Props:

- `rows`: Number of table rows (default: 5)
- `columns`: Number of table columns (default: 4)
- `isLoading`: Whether to show the skeleton (default: true)
- `className`: Additional CSS classes

### SkeletonCustom

```tsx
<SkeletonCustom variant="profile" isLoading={true} className="my-4" />
```

Props:

- `variant`: Layout variant (options: 'profile', 'dashboard', 'article', default: 'profile')
- `isLoading`: Whether to show the skeleton (default: true)
- `className`: Additional CSS classes

## Best Practices

1. **Matching Layout**: Choose the skeleton component that most closely matches your actual content layout.

2. **Match Dimensions**: Set rows and columns to match the expected content to prevent layout shifts when content loads.

3. **Conditional Rendering**: Use the `isLoading` prop to control when skeletons are displayed.

4. **Consistent Styling**: Use `className` to maintain consistent spacing and dimensions with your content.

5. **Performance**: For large lists, consider limiting the number of skeleton items to improve performance.

## Example Component: Dashboard

Here's an example of using multiple skeleton components to create a dashboard loading state:

```tsx
import { useRemoteQuery } from '~/shared/api/query';
import {
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  SkeletonCustom
} from '~/shared/ui/skeleton';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useRemoteQuery(['dashboard', 'stats'], '/api/dashboard/stats');
  const { data: users, isLoading: usersLoading } = useRemoteQuery(['dashboard', 'recent-users'], '/api/users/recent');
  const { data: activities, isLoading: activitiesLoading } = useRemoteQuery(['dashboard', 'activities'], '/api/activities');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonCard rows={1} columns={3} isLoading={statsLoading} />
        {!statsLoading && stats && (
          /* Stats cards rendering */
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Users */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Users</h2>
          <SkeletonList rows={5} isLoading={usersLoading} />
          {!usersLoading && users && (
            /* Users list rendering */
          )}
        </div>

        {/* Activity Chart */}
        <div>
          <h2 className="text-xl font-bold mb-4">Activity</h2>
          <SkeletonCustom variant="dashboard" isLoading={activitiesLoading} />
          {!activitiesLoading && activities && (
            /* Activity chart rendering */
          )}
        </div>
      </div>
    </div>
  );
};
```

## Conclusion

These skeleton components provide a simple and consistent way to handle loading states in your application. By choosing the appropriate skeleton component for each part of your UI, you can create a smoother user experience during data loading.
