// src/shared/ui/data-table/model/useTableState.ts
import { useState } from 'react';

import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table';

/**
 * Row Selection State Type
 */
export type RowSelectionState = Record<string, boolean>;

/**
 * Table State Type
 */
export interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  globalFilter: string;
  isExpanded: boolean;
}

/**
 * Table State Actions
 */
export interface TableStateActions {
  setSorting: (sorting: SortingState) => void;
  setColumnFilters: (filters: ColumnFiltersState) => void;
  setColumnVisibility: (visibility: VisibilityState) => void;
  setRowSelection: (selection: RowSelectionState) => void;
  setGlobalFilter: (filter: string) => void;
  toggleExpanded: () => void;
  resetFilters: () => void;
}

/**
 * Hook Return Type
 */
export interface UseTableStateReturn {
  state: TableState;
  actions: TableStateActions;
}

/**
 * Hook Props
 */
interface UseTableStateProps {
  defaultSorting?: SortingState;
  defaultColumnVisibility?: VisibilityState;
  expandable?: boolean;
}

/**
 * Hook für zentrales Table State Management
 */
export const useTableState = ({
  defaultSorting = [],
  defaultColumnVisibility = {},
  expandable = false,
}: UseTableStateProps = {}): UseTableStateReturn => {
  // State pieces with proper types
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(!expandable);

  // Actions
  const resetFilters = () => {
    setColumnFilters([]);
    setGlobalFilter('');
  };

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  // Combined state object
  const state: TableState = {
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    globalFilter,
    isExpanded,
  };

  // Actions object
  const actions: TableStateActions = {
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setRowSelection,
    setGlobalFilter,
    toggleExpanded,
    resetFilters,
  };

  return { state, actions };
};
