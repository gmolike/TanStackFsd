import type {
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

/**
 * Complete Table State
 */
export type TableState = {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  globalFilter: string;
  isExpanded: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
};

/**
 * Table State Actions
 */
export type TableStateActions = {
  setSorting: (sorting: SortingState) => void;
  setColumnFilters: (filters: ColumnFiltersState) => void;
  setColumnVisibility: (visibility: VisibilityState) => void;
  setRowSelection: (selection: RowSelectionState) => void;
  setGlobalFilter: (filter: string) => void;
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
  toggleExpanded: () => void;
  resetFilters: () => void;
};
