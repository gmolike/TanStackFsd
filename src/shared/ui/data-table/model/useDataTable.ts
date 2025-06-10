// src/shared/ui/data-table/hooks/useDataTable.ts
import { useMemo, useState } from 'react';

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

import type { DataTableProps, TableDataConstraint } from '../types';

/**
 * Unified Data Table Hook
 * @description Kombiniert alle Table-bezogenen Hooks in einem zentralen Hook
 */

// ===== TYPE DEFINITIONS =====

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
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
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
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
  toggleExpanded: () => void;
  resetFilters: () => void;
}

/**
 * Table Features
 */
export interface TableFeatures {
  hasExpand: boolean;
  hasSelection: boolean;
  hasGlobalFilter: boolean;
  showsSkeleton: boolean;
  hasToolbar: boolean;
  hasPagination: boolean;
}

/**
 * Controller Return Type
 */
export interface DataTableController<TData extends TableDataConstraint, TValue = unknown> {
  // Table Instance
  table: Table<TData>;

  // State
  state: TableState;
  actions: TableStateActions;
  features: TableFeatures;
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

// ===== MAIN HOOK =====

/**
 * useDataTable - Zentaler Hook für alle DataTable-Funktionalität
 * @param props - DataTable Props
 * @returns Vollständiger Controller mit State und Actions
 */
export const useDataTable = <TData extends TableDataConstraint, TValue = unknown>(
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
    showColumnToggle,
    onAddClick,
  } = props;

  // ===== STATE MANAGEMENT =====
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(!expandable);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  // State Actions
  const resetFilters = () => {
    setColumnFilters([]);
    setGlobalFilter('');
  };

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  // Combined State
  const state: TableState = {
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    globalFilter,
    isExpanded,
    pagination,
  };

  const actions: TableStateActions = {
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setRowSelection,
    setGlobalFilter,
    setPagination,
    toggleExpanded,
    resetFilters,
  };

  // ===== FEATURE DETECTION =====
  const features: TableFeatures = useMemo(
    () => ({
      hasExpand: !!expandable && typeof initialRowCount === 'number',
      hasSelection: !!enableRowSelection,
      hasGlobalFilter: enableGlobalFilter !== false,
      showsSkeleton: !!withSkeleton && !!isLoading,
      hasToolbar: enableGlobalFilter !== false || !!showColumnToggle || !!onAddClick,
      hasPagination: !expandable || data.length > (props.pageSize ?? 10),
    }),
    [
      expandable,
      initialRowCount,
      enableRowSelection,
      enableGlobalFilter,
      withSkeleton,
      isLoading,
      showColumnToggle,
      onAddClick,
      data.length,
      props.pageSize,
    ],
  );

  // ===== TABLE INSTANCE =====

  // Type-safe state setters
  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(typeof updater === 'function' ? updater(sorting) : updater);
  };

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    setColumnFilters(typeof updater === 'function' ? updater(columnFilters) : updater);
  };

  const onColumnVisibilityChange: OnChangeFn<VisibilityState> = (updater) => {
    setColumnVisibility(typeof updater === 'function' ? updater(columnVisibility) : updater);
  };

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    if (enableRowSelection) {
      setRowSelection(typeof updater === 'function' ? updater(rowSelection) : updater);
    }
  };

  const onGlobalFilterChange: OnChangeFn<string> = (updater) => {
    if (enableGlobalFilter) {
      setGlobalFilter(typeof updater === 'function' ? updater(globalFilter) : updater);
    }
  };

  // Create table instance
  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: enableGlobalFilter ? globalFilter : undefined,
      pagination,
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
  });

  // ===== COMPUTED VALUES =====
  const isTableExpanded = expandable ? isExpanded : true;
  const hasData = data.length > 0;
  const filteredRowsCount = table.getFilteredRowModel().rows.length;
  const showExpandButton = expandable && filteredRowsCount > initialRowCount;
  const shouldShowSkeleton = withSkeleton && isLoading;

  // Get rows from table
  const allRows = table.getFilteredRowModel().rows;
  const paginatedRows = table.getPaginationRowModel().rows;

  // Display Rows Logic
  const displayRows = useMemo(() => {
    // Wenn expandiert (oder nicht expandable), nutze normale Pagination
    if (isTableExpanded) {
      return paginatedRows;
    }
    // Im kollabierten Zustand, zeige nur initialRowCount
    return allRows.slice(0, initialRowCount);
  }, [isTableExpanded, paginatedRows, allRows, initialRowCount]);

  // ===== EVENT HANDLERS =====
  const handleExpandToggle = () => {
    if (isExpanded) {
      // Beim Kollabieren: keine Pagination nötig
      setPagination({ pageIndex: 0, pageSize: filteredRowsCount || pageSize });
    } else {
      // Beim Expandieren: aktiviere normale Pagination
      setPagination({ pageIndex: 0, pageSize });
    }
    toggleExpanded();
  };

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
  };

  // ===== UTILITIES =====
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
    actions,
    features,
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
