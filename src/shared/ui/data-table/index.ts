/**
 * DataTable Public API - Optimiert für FSD ohne zirkuläre Abhängigkeiten
 *
 * Export-Regeln:
 * 1. Hauptkomponente direkt exportieren
 * 2. Types als Type-Exports für Tree-Shaking
 * 3. Wiederverwendbare Components
 * 4. Utils nur wenn extern benötigt
 */

// ========================================
// 1. HAUPT-KOMPONENTE
// ========================================
export { DataTable } from './DataTable';

// ========================================
// 2. TYPES (als type exports)
// ========================================
// Core Types aus table-definition
export type {
  DataTableProps,
  ExtractFieldIds,
  FieldDefinition,
  TableDefinition,
} from './model/table-definition';

// Erweiterte Types aus types.ts (falls vorhanden)
export type {
  BaseDataTableProps,
  DataTableFeatures,
  ExpandButtonProps,
  PaginationProps,
  RowSelectionState,
  TableDataConstraint,
  TableSkeletonProps,
  ToolbarProps,
} from './types';

// ========================================
// 3. WIEDERVERWENDBARE KOMPONENTEN
// ========================================
// Components die oft extern verwendet werden
export { EmptyState } from './components/EmptyState';
export { ErrorState } from './components/ErrorState';
export { ExpandButton } from './components/ExpandButton';

// ========================================
// 4. CELL COMPONENTS & TEMPLATES
// ========================================
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

// Cell Buttons
export {
  CompactDeleteButton,
  TableDeleteButton,
  type TableDeleteButtonProps,
  TableEditButton,
  type TableEditButtonProps,
} from './components/CellButtons';

// ========================================
// 5. HEADER COMPONENTS
// ========================================
export {
  FilterableHeader,
  headerTemplates,
  type HeaderType,
  SimpleHeader,
  SortableHeader,
} from './components/CellHeaders';

// ========================================
// 6. STANDARD CELLS (falls vorhanden)
// ========================================
// Falls du die standard-components verwendest
export {
  StandardContactCell,
  type StandardContactCellProps,
  StandardEmailCell,
  type StandardEmailCellProps,
  StandardPhoneCell,
  type StandardPhoneCellProps,
} from './standard-components/Cells';

// ========================================
// 7. UTILS & HELPERS
// ========================================
// Table Converter
export {
  convertTableDefinition,
  getColumnVisibility,
  getSearchableColumns,
} from './model/table-converter';

// Helper Functions (falls vorhanden)
export { createSkeletonData, createTableConfig, formatColumnLabels } from './utils/tableHelpers';

// ========================================
// 8. PRESETS (falls vorhanden)
// ========================================
export { tablePresets } from './types';

// ========================================
// BEWUSST NICHT EXPORTIERT:
// ========================================
// - TablePagination (intern in DataTable)
// - TableSkeleton (intern in DataTable)
// - TableToolbar (intern in DataTable)
// - useDataTable (interner Hook)
// ========================================

/**
 * Verwendungsbeispiele:
 *
 * @example
 * // Standard DataTable Import
 * import { DataTable } from '~/shared/ui/data-table';
 *
 * @example
 * // Type-safe Imports
 * import type { DataTableProps, TableDefinition } from '~/shared/ui/data-table';
 *
 * @example
 * // Cell Components
 * import { EmailCell, PhoneCell, TableEditButton } from '~/shared/ui/data-table';
 *
 * @example
 * // Mit Table Definition
 * const tableDefinition: TableDefinition<TeamMember> = {
 *   labels: teamLabels,
 *   fields: [
 *     { id: 'name', accessor: 'name', sortable: true, searchable: true },
 *     { id: 'email', accessor: 'email', cell: EmailCell },
 *     { id: 'actions', cell: 'actions' }
 *   ]
 * };
 *
 * <DataTable
 *   tableDefinition={tableDefinition}
 *   data={members}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 */
