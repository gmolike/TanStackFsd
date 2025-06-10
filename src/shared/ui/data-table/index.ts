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

// Hooks
export { useTableFeatures } from './hooks/useTableFeatures';

// Model
export { useDataTableController } from './model/useDataTableController';
export { useTableState } from './model/useTableState';

// Types
export type {
  BaseDataTableProps,
  DataTableController,
  DataTableFeatures,
  DataTableProps,
  ExpandButtonProps,
  PaginationProps,
  TableDataConstraint,
  TableSkeletonProps,
  // Re-exported from model
  TableState,
  TableStateActions,
  ToolbarProps,
  UseTableStateReturn,
} from './types';

// Type Guards and Constants
export { hasError, isExpandable, isLoading, tablePresets } from './types';

// Utils
export { createSkeletonData, createTableConfig, formatColumnLabels } from './utils/tableHelpers';
