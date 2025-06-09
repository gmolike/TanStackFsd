// src/shared/ui/data-table/hooks/useTableFeatures.ts
import { useMemo } from 'react';

import type { DataTableProps } from '../types';

/**
 * Feature Detection für DataTable
 */
type TableFeatures = {
  /** Hat die Tabelle ein Expand-Feature? */
  hasExpand: boolean;
  /** Hat die Tabelle Row-Selection? */
  hasSelection: boolean;
  /** Hat die Tabelle globale Suche? */
  hasGlobalFilter: boolean;
  /** Zeigt die Tabelle einen Skeleton? */
  showsSkeleton: boolean;
  /** Hat die Tabelle eine Toolbar? */
  hasToolbar: boolean;
  /** Hat die Tabelle Pagination? */
  hasPagination: boolean;
};

/**
 * Hook zur Feature-Erkennung basierend auf Props
 *
 * @param props - DataTable Props
 * @returns Erkannte Features
 *
 * @example
 * ```tsx
 * const features = useTableFeatures(props);
 * if (features.hasExpand) {
 *   // Handle expandable logic
 * }
 * ```
 */
export const useTableFeatures = <TData, TValue>(
  props: DataTableProps<TData, TValue>,
): TableFeatures =>
  useMemo(
    () => ({
      hasExpand: !!props.expandable && typeof props.initialRowCount === 'number',
      hasSelection: !!props.enableRowSelection,
      hasGlobalFilter: props.enableGlobalFilter !== false,
      showsSkeleton: !!props.withSkeleton && !!props.isLoading,
      hasToolbar:
        props.enableGlobalFilter !== false || !!props.showColumnToggle || !!props.onAddClick,
      hasPagination: !props.expandable || props.data.length > (props.initialRowCount || 5),
    }),
    [
      props.expandable,
      props.initialRowCount,
      props.enableRowSelection,
      props.enableGlobalFilter,
      props.withSkeleton,
      props.isLoading,
      props.showColumnToggle,
      props.onAddClick,
      props.data.length,
    ],
  );
