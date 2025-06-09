// src/shared/ui/data-table/index.ts
/**
 * DataTable Public API
 *
 * Exportiert die vereinheitlichte DataTable-Komponente und zugehörige Typen.
 *
 * @module shared/ui/data-table
 */

// Haupt-Komponente
export { DataTable } from './DataTable';

// Types
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

// Presets und Utils
export { hasError, isExpandable, isLoading, tablePresets } from './types';

// Hooks (falls extern benötigt)
export { useTableFeatures } from './hooks/useTableFeatures';
export { useTableState } from './hooks/useTableState';

// Sub-Components (falls einzeln benötigt)
export { EmptyState } from './components/EmptyState';
export { ErrorState } from './components/ErrorState';
export { ExpandButton } from './components/ExpandButton';
export { TablePagination } from './components/TablePagination';
export { TableSkeleton } from './components/TableSkeleton';
export { TableToolbar } from './components/TableToolbar';

// Helper Utils
export { createSkeletonData, createTableConfig, formatColumnLabels } from './utils/tableHelpers';
