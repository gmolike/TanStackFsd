// src/shared/ui/data-table/index.ts
/**
 * DataTable Public API
 *
 * Exportiert die vereinheitlichte DataTable-Komponente und zugehörige Typen.
 *
 * @module shared/ui/data-table
 */

// Components
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

// Unified Hook
export type {
  DataTableController,
  RowSelectionState,
  TableFeatures,
  TableState,
  TableStateActions,
} from './model/useDataTable';
export { useDataTable } from './model/useDataTable';

// Types
export type {
  BaseDataTableProps,
  DataTableFeatures,
  DataTableProps,
  ExpandButtonProps,
  PaginationProps,
  TableDataConstraint,
  TableSkeletonProps,
  ToolbarProps,
} from './types';

// Type Guards and Constants
export { hasError, isExpandable, isLoading, tablePresets } from './types';

// Utils
export { createSkeletonData, createTableConfig, formatColumnLabels } from './utils/tableHelpers';
