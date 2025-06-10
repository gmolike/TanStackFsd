// src/shared/ui/data-table/model/useDataTableController.ts
import { useMemo } from 'react';

import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  Row,
  SortingState,
  Table,
  VisibilityState,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { DataTableProps, RowSelectionState, TableState } from '../types';

import { useTableState } from './useTableState';

/**
 * Controller Return Type
 */
export interface DataTableController<TData, TValue = unknown> {
  // Table Instance
  table: Table<TData>;

  // State
  state: TableState;
  isTableExpanded: boolean;

  // Computed Values
  displayRows: Array<Row<TData>>;
  hasData: boolean;
  filteredRowsCount: number;
  showExpandButton: boolean;
  shouldShowSkeleton: boolean;

  // Actions
  handleExpandToggle: () => void;
  handleGlobalFilterChange: (value: string) => void;

  // Utilities
  getRowId: (row: TData) => string;

  // Pass through props for UI
  columns: Array<ColumnDef<TData, TValue>>;
}

/**
 * Data Table Controller Hook
 * Kapselt die gesamte Business-Logik der DataTable
 */
export const useDataTableController = <TData extends { id?: string }, TValue = unknown>(
  props: DataTableProps<TData, TValue>,
): DataTableController<TData, TValue> => {
  const {
    // Data
    columns,
    data,

    // Configuration
    defaultSorting = [],
    defaultColumnVisibility = {},
    pageSize = 10,

    // Features
    expandable = false,
    initialRowCount = 5,
    enableRowSelection = false,
    enableGlobalFilter = true,
    withSkeleton = false,
    isLoading = false,
  } = props;

  // State Management
  const {
    state,
    actions: {
      setSorting,
      setColumnFilters,
      setColumnVisibility,
      setRowSelection,
      setGlobalFilter,
      toggleExpanded,
    },
  } = useTableState({
    defaultSorting,
    defaultColumnVisibility,
    expandable,
  });

  // Type-safe state setters
  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(typeof updater === 'function' ? updater(state.sorting) : updater);
  };

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    setColumnFilters(typeof updater === 'function' ? updater(state.columnFilters) : updater);
  };

  const onColumnVisibilityChange: OnChangeFn<VisibilityState> = (updater) => {
    setColumnVisibility(typeof updater === 'function' ? updater(state.columnVisibility) : updater);
  };

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    if (enableRowSelection) {
      setRowSelection(typeof updater === 'function' ? updater(state.rowSelection) : updater);
    }
  };

  const onGlobalFilterChange: OnChangeFn<string> = (updater) => {
    if (enableGlobalFilter) {
      setGlobalFilter(typeof updater === 'function' ? updater(state.globalFilter) : updater);
    }
  };

  // Table Instance mit korrekten Typen
  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      rowSelection: state.rowSelection,
      globalFilter: enableGlobalFilter ? state.globalFilter : undefined,
    },
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange,
    onRowSelectionChange: enableRowSelection ? onRowSelectionChange : undefined,
    onGlobalFilterChange: enableGlobalFilter ? onGlobalFilterChange : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
    enableRowSelection,
    initialState: {
      pagination: {
        pageSize: expandable && !state.isExpanded ? initialRowCount : pageSize,
      },
    },
  });

  // Computed Values
  const isTableExpanded = expandable ? state.isExpanded : true;
  const hasData = data.length > 0;
  const filteredRowsCount = table.getFilteredRowModel().rows.length;
  const showExpandButton = expandable && filteredRowsCount > initialRowCount;
  const shouldShowSkeleton = withSkeleton && isLoading;

  // Get rows from table
  const allRows = table.getFilteredRowModel().rows;
  const paginatedRows = table.getPaginationRowModel().rows;

  // Display Rows Logic - WICHTIG: Alle Dependencies müssen korrekt sein
  const displayRows = useMemo(() => {
    // Wenn Pagination aktiv ist, nutze paginatedRows
    if (!expandable || isTableExpanded) {
      return paginatedRows;
    }
    // Sonst nutze gefilterte Rows mit Limit
    return allRows.slice(0, initialRowCount);
  }, [expandable, isTableExpanded, paginatedRows, allRows, initialRowCount]);

  // Event Handlers
  const handleExpandToggle = () => {
    if (state.isExpanded) {
      // Beim Kollabieren
      table.setPageSize(initialRowCount);
      table.setPageIndex(0);
    } else {
      // Beim Expandieren
      table.setPageSize(pageSize);
    }
    toggleExpanded();
  };

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
  };

  // Utilities
  const getRowId = (row: TData): string => {
    if (row.id) return row.id;
    // Fallback für Rows ohne ID
    return JSON.stringify(row);
  };

  return {
    // Table Instance
    table,

    // State
    state,
    isTableExpanded,

    // Computed Values
    displayRows,
    hasData,
    filteredRowsCount,
    showExpandButton,
    shouldShowSkeleton,

    // Actions
    handleExpandToggle,
    handleGlobalFilterChange,

    // Utilities
    getRowId,

    // Pass through props for UI
    columns,
  };
};
