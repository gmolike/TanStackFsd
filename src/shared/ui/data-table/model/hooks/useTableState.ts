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
  const [sorting, setSortingState] = useState<SortingState>([]);
  const [columnFilters, setColumnFiltersState] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibilityState] = useState<VisibilityState>({});
  const [isExpanded, setIsExpanded] = useState<boolean>(!props.expandable);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: props.pageSize ?? 10,
  });

  // Type-safe state setters für TanStack Table
  const setSorting: OnChangeFn<SortingState> = (updaterOrValue: Updater<SortingState>) => {
    if (typeof updaterOrValue === 'function') {
      setSortingState((prev) => updaterOrValue(prev));
    } else {
      setSortingState(updaterOrValue);
    }
  };

  const setColumnFilters: OnChangeFn<ColumnFiltersState> = (
    updaterOrValue: Updater<ColumnFiltersState>,
  ) => {
    if (typeof updaterOrValue === 'function') {
      setColumnFiltersState((prev) => updaterOrValue(prev));
    } else {
      setColumnFiltersState(updaterOrValue);
    }
  };

  const setColumnVisibility: OnChangeFn<VisibilityState> = (
    updaterOrValue: Updater<VisibilityState>,
  ) => {
    if (typeof updaterOrValue === 'function') {
      setColumnVisibilityState((prev) => updaterOrValue(prev));
    } else {
      setColumnVisibilityState(updaterOrValue);
    }
  };

  return {
    // State values
    sorting,
    columnFilters,
    columnVisibility,
    isExpanded,
    pagination,

    // State setters
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setIsExpanded,
    setPagination,

    // Utility functions
    resetFilters: () => {
      setColumnFiltersState([]);
    },
  };
};
