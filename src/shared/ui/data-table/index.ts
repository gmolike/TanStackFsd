// shared/ui/data-table/index.ts

// Main Component
export { DataTable } from './DataTable';

// Types
export type {
  DataTableProps,
  ExtractFieldIds,
  FieldDefinition,
  TableDefinition
} from './model/table-definition';

// Components
export { CompactDeleteButton, TableDeleteButton, TableEditButton } from './components/CellButtons';
export { EmptyState } from './components/EmptyState';
export { ErrorState } from './components/ErrorState';
export { ExpandButton } from './components/ExpandButton';
export { TablePagination } from './components/TablePagination';
export { TableSkeleton } from './components/TableSkeleton';
export { TableToolbar } from './components/TableToolbar';

// Cell Templates
export {
  ActionsCell,
  BooleanCell,
  type CellTemplateName,
  cellTemplates,
  DateCell,
  EmailCell,
  PhoneCell,
  TextCell,
} from './components/CellTemplates';

// Cell Headers
export {
  FilterableHeader,
  headerTemplates,
  type HeaderType,
  SimpleHeader,
  SortableHeader,
} from './components/CellHeaders';

// Utils
export {
  convertTableDefinition,
  getColumnVisibility,
  getSearchableColumns,
} from './model/table-converter';
