// src/shared/ui/data-table/index.ts
/**
 * DataTable Public API
 *
 * Exportiert die vereinheitlichte DataTable-Komponente und zugehörige Typen.
 *
 * @module shared/ui/data-table
 */

export { EmptyState } from './components/EmptyState';
export { ErrorState } from './components/ErrorState';
export { ExpandButton } from './components/ExpandButton';
export type { TableDeleteButtonProps, TableEditButtonProps } from './components/StandardButtons';
export {
  CompactDeleteButton,
  TableDeleteButton,
  TableEditButton,
} from './components/StandardButtons';
export type {
  StandardContactCellProps,
  StandardEmailCellProps,
  StandardPhoneCellProps,
} from './components/StandardCells';
export {
  StandardContactCell,
  StandardEmailCell,
  StandardPhoneCell,
} from './components/StandardCells';
export { TablePagination } from './components/TablePagination';
export { TableSkeleton } from './components/TableSkeleton';
export { TableToolbar } from './components/TableToolbar';
export { DataTable } from './DataTable';
export { useTableFeatures } from './hooks/useTableFeatures';
export { useTableState } from './hooks/useTableState';
export type {
  BaseDataTableProps,
  DataTableFeatures,
  DataTableProps,
  ExpandButtonProps,
  PaginationProps,
  TableSkeletonProps,
  TableState,
  ToolbarProps,
  UseTableStateReturn,
} from './types';
export { hasError, isExpandable, isLoading, tablePresets } from './types';
export { createSkeletonData, createTableConfig, formatColumnLabels } from './utils/tableHelpers';
