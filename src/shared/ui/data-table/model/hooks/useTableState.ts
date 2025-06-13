import { useState } from 'react';

import type {
  ColumnFiltersState,
  OnChangeFn,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';

import type { DataTableProps } from '../types/props';
import type { TableDefinition } from '../types/table-definition';

export interface TableStateReturn {
  // State values
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  isExpanded: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };

  // State setters
  setSorting: OnChangeFn<SortingState>;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  setColumnVisibility: OnChangeFn<VisibilityState>;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;

  // Utility functions
  resetFilters: () => void;
}

export const useTableState = <
  TData extends Record<string, unknown>,
  TTableDef extends TableDefinition<TData>,
>(
  props: DataTableProps<TData, TTableDef>,
): TableStateReturn => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isExpanded, setIsExpanded] = useState<boolean>(!props.expandable);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: props.pageSize ?? 10,
  });

  // Type-safe state setters für TanStack Table
  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue: Updater<SortingState>) => {
    setSorting(updaterOrValue);
  };

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (
    updaterOrValue: Updater<ColumnFiltersState>,
  ) => {
    setColumnFilters(updaterOrValue);
  };

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (
    updaterOrValue: Updater<VisibilityState>,
  ) => {
    setColumnVisibility(updaterOrValue);
  };

  return {
    // State values
    sorting,
    columnFilters,
    columnVisibility,
    isExpanded,
    pagination,

    // State setters
    setSorting: handleSortingChange,
    setColumnFilters: handleColumnFiltersChange,
    setColumnVisibility: handleColumnVisibilityChange,
    setIsExpanded,
    setPagination,

    // Utility functions
    resetFilters: () => {
      setColumnFilters([]);
    },
  };
};
