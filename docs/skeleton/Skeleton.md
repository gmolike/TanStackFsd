# Skeleton Components for FSD Architecture

This documentation covers the skeleton component system built for Feature-Sliced Design (FSD) architecture using ShadCN UI.

## Table of Contents

- [Skeleton Components for FSD Architecture](#skeleton-components-for-fsd-architecture)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Installation](#installation)
  - [Component API](#component-api)
    - [Base Skeleton](#base-skeleton)
    - [SkeletonList](#skeletonlist)
    - [SkeletonCard](#skeletoncard)
    - [SkeletonTable](#skeletontable)
    - [SkeletonCustom](#skeletoncustom)
  - [Usage with TanStack Query](#usage-with-tanstack-query)
  - [Examples](#examples)
    - [Basic Skeleton](#basic-skeleton)
    - [List Example](#list-example)
    - [Card Grid Example](#card-grid-example)
    - [Table Example](#table-example)
    - [Custom Variant Example](#custom-variant-example)
  - [Best Practices](#best-practices)

## Introduction

Skeleton components provide visual placeholders while content is loading, improving user experience by reducing perceived loading times and preventing layout shifts. This package offers standardized skeleton components designed for common UI patterns in line with the Feature-Sliced Design architecture.

The components leverage ShadCN UI's base Skeleton component, ensuring a consistent look and feel with your application's design system.

## Installation

These skeleton components are already part of your shared UI layer. They're located in:

```
src/
└── shared/
    └── ui/
        └── skeleton/
```

To use them, simply import the required components:

```tsx
import {
  Skeleton,
  SkeletonList,
  SkeletonCard,
  SkeletonTable,
  SkeletonCustom,
} from '~/shared/ui/skeleton';
```

## Component API

### Base Skeleton

The base `Skeleton` component is directly re-exported from ShadCN UI.

```tsx
import { Skeleton } from '~/shared/ui/skeleton';

<Skeleton className="h-4 w-40" />;
```

**Props:**

| Prop        | Type             | Default | Description             |
| ----------- | ---------------- | ------- | ----------------------- |
| `className` | `string`         | -       | Additional CSS classes  |
| `...props`  | `HTMLDivElement` | -       | Any HTML div attributes |

### SkeletonList

The `SkeletonList` component creates a skeleton for list layouts, such as user lists, comment lists, or notification feeds.

```tsx
import { SkeletonList } from '~/shared/ui/skeleton';

<SkeletonList rows={3} columns={1} isLoading={true} className="my-4" />;
```

**Props:**

| Prop        | Type      | Default | Description                        |
| ----------- | --------- | ------- | ---------------------------------- |
| `rows`      | `number`  | `3`     | Number of list items to display    |
| `columns`   | `number`  | `1`     | Number of columns in the list grid |
| `isLoading` | `boolean` | `true`  | Whether to show the skeleton       |
| `className` | `string`  | -       | Additional CSS classes             |

### SkeletonCard

The `SkeletonCard` component creates a skeleton for card layouts, such as product cards, content cards, or dashboard widgets.

```tsx
import { SkeletonCard } from '~/shared/ui/skeleton';

<SkeletonCard rows={1} columns={3} isLoading={true} className="my-4" />;
```

**Props:**

| Prop        | Type      | Default | Description                        |
| ----------- | --------- | ------- | ---------------------------------- |
| `rows`      | `number`  | `1`     | Number of rows in the card grid    |
| `columns`   | `number`  | `1`     | Number of columns in the card grid |
| `isLoading` | `boolean` | `true`  | Whether to show the skeleton       |
| `className` | `string`  | -       | Additional CSS classes             |

### SkeletonTable

The `SkeletonTable` component creates a skeleton for table layouts, such as data tables, spreadsheets, or any tabular data.

```tsx
import { SkeletonTable } from '~/shared/ui/skeleton';

<SkeletonTable rows={5} columns={4} isLoading={true} className="my-4" />;
```

**Props:**

| Prop        | Type      | Default | Description                  |
| ----------- | --------- | ------- | ---------------------------- |
| `rows`      | `number`  | `5`     | Number of table rows         |
| `columns`   | `number`  | `4`     | Number of table columns      |
| `isLoading` | `boolean` | `true`  | Whether to show the skeleton |
| `className` | `string`  | -       | Additional CSS classes       |

### SkeletonCustom

The `SkeletonCustom` component provides pre-configured layouts for common UI patterns such as user profiles, dashboard widgets, or articles.

```tsx
import { SkeletonCustom } from '~/shared/ui/skeleton';

<SkeletonCustom variant="profile" isLoading={true} className="my-4" />;
```

**Props:**

| Prop        | Type                                    | Default     | Description                  |
| ----------- | --------------------------------------- | ----------- | ---------------------------- |
| `variant`   | `'profile' \| 'dashboard' \| 'article'` | `'profile'` | The layout variant to use    |
| `isLoading` | `boolean`                               | `true`      | Whether to show the skeleton |
| `className` | `string`                                | -           | Additional CSS classes       |

## Usage with TanStack Query

The skeleton components integrate perfectly with TanStack Query. Here's a basic example:

```tsx
import { useRemoteQuery } from '~/shared/api/query';
import { SkeletonList } from '~/shared/ui/skeleton';

const UserList = () => {
  const { data, isLoading } = useRemoteQuery(['users'], '/api/users');

  return (
    <div>
      <SkeletonList rows={5} isLoading={isLoading} />

      {!isLoading && data && (
        <ul>
          {data.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

For a more streamlined approach, you can use the `useQueryWithSkeleton` hook:

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

  if (error) return <ErrorComponent error={error} />;

  return (
    <div>
      {renderSkeleton()}

      {data && (
        <div className="grid grid-cols-3 gap-4">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
```

## Examples

### Basic Skeleton

```tsx
<Skeleton className="h-4 w-40" />
<Skeleton className="h-10 w-full" />
```

### List Example

```tsx
// Loading state with skeleton
{
  isLoading ? (
    <SkeletonList rows={5} isLoading={true} />
  ) : (
    // Actual content
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center space-x-4">
          <div className="bg-primary/10 h-12 w-12 rounded-full"></div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Card Grid Example

```tsx
// Loading state with skeleton
{
  isLoading ? (
    <SkeletonCard rows={2} columns={3} isLoading={true} />
  ) : (
    // Actual content
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="flex flex-col space-y-3">
          <div className="bg-muted h-40 rounded-md"></div>
          <h4 className="text-lg font-medium">{product.name}</h4>
          <p className="text-muted-foreground text-sm">{product.description}</p>
          <p className="font-bold">${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Table Example

```tsx
// Loading state with skeleton
{
  isLoading ? (
    <SkeletonTable rows={5} columns={4} isLoading={true} />
  ) : (
    // Actual content
    <div>
      <div className="grid grid-cols-4 gap-4 font-bold">
        <div>ID</div>
        <div>Name</div>
        <div>Category</div>
        <div>Status</div>
      </div>

      {data.map((item) => (
        <div key={item.id} className="grid grid-cols-4 gap-4">
          <div>{item.id}</div>
          <div>{item.name}</div>
          <div>{item.category}</div>
          <div>{item.status}</div>
        </div>
      ))}
    </div>
  );
}
```

### Custom Variant Example

```tsx
<SkeletonCustom variant="profile" isLoading={true} className="max-w-md" />
```

## Best Practices

1. **Component Selection**: Choose the appropriate skeleton component that matches your content layout:

   - Use `SkeletonList` for list-like content
   - Use `SkeletonCard` for card-like content
   - Use `SkeletonTable` for tabular data
   - Use `SkeletonCustom` for specific UI patterns

2. **Rows and Columns**: Set appropriate `rows` and `columns` values that match your actual content to avoid layout shifts.

3. **Conditional Rendering**: Always use the `isLoading` prop to conditionally render the skeleton. The component handles this internally, returning `null` when `isLoading` is `false`.

4. **Consistent Styling**: Use the `className` prop to apply consistent spacing and dimensions to match your content layout.

5. **Performance**: For lists with many items, consider limiting the number of skeleton items to improve performance.

6. **Integration with Data Fetching**: Use the `useQueryWithSkeleton` hook for a more streamlined approach when working with TanStack Query.
