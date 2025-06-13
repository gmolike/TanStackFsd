import { useMemo } from 'react';

import type { DataTableProps } from '../types/props';
import type { TableDefinition } from '../types/table-definition';

export interface TableFeaturesReturn {
  hasToolbar: boolean;
  hasPagination: boolean;
  hasExpand: boolean;
  hasSelection: boolean;
  hasGlobalFilter: boolean;
  showsSkeleton: boolean;
}

export const useTableFeatures = <
  TData extends Record<string, unknown>,
  TTableDef extends TableDefinition<TData>,
>(
  props: DataTableProps<TData, TTableDef>,
): TableFeaturesReturn =>
  useMemo(
    () => ({
      hasToolbar:
        props.searchPlaceholder !== undefined ||
        props.showColumnToggle !== false ||
        props.onAdd !== undefined,

      hasPagination: !props.expandable || props.data.length > (props.pageSize ?? 10),

      hasExpand: props.expandable === true && typeof props.initialRowCount === 'number',

      hasSelection: false,

      hasGlobalFilter: true,

      showsSkeleton: props.isLoading === true && props.data.length === 0,
    }),
    [
      props.searchPlaceholder,
      props.showColumnToggle,
      props.onAdd,
      props.expandable,
      props.data.length,
      props.pageSize,
      props.initialRowCount,
      props.isLoading,
    ],
  );
