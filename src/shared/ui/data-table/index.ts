// Main Component
export { DataTable } from './ui/DataTable';

// Types - aus props.ts exportieren
export type { DataTableProps } from './model/types/props';

// Types - aus table-definition.ts exportieren
export type { DataTableController } from './model/hooks/useDataTable';
export type { TableState, TableStateActions } from './model/types/state';
export type {
  CellComponentProps,
  ExtractFieldIds,
  FieldDefinition,
  TableDefinition,
} from './model/types/table-definition';

// Cells
export * from './ui/cells';

// Headers
export * from './ui/headers';

// States
export { EmptyState } from './ui/states/EmptyState';
export { ErrorState } from './ui/states/ErrorState';
export { LoadingState } from './ui/states/LoadingState';
export { SkeletonState } from './ui/states/SkeletonState';

// Features
export { ExpandButton } from './ui/features/ExpandButton';
export { ExportButton, type ExportFormat } from './ui/features/ExportButton';
export { type FilterPreset, FilterPresets } from './ui/features/FilterPresets';
export { Pagination } from './ui/features/Pagination';

// Toolbar Components
export { type BulkAction, BulkActions } from './ui/toolbar/BulkActions';

// Utils
export * from './model/converters/table-converter';
export * from './model/utils/display-utils';
export * from './model/utils/filter-utils';
export * from './model/utils/table-helpers';

// Constants & Defaults
export * from './lib/constants';
export * from './lib/defaults';

// Context & Hooks
export {
  useDataTableCallbacks,
  useDataTableContext,
  useDataTableFeatures,
  useDataTableState,
  useDataTableTable,
  useDataTableUI,
} from './lib/context';

// Hooks (for advanced usage)
export { useDataTable } from './model/hooks/useDataTable';
export { useTableFeatures } from './model/hooks/useTableFeatures';
export { useTableSearch } from './model/hooks/useTableSearch';
export { useTableSelection } from './model/hooks/useTableSelection';
export { useTableState } from './model/hooks/useTableState';
