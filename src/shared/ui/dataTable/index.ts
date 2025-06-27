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
export type { DataTableProps, FieldDefinition, TableDefinition } from './model/tableDefinition';
export { createTableDefinition } from './model/tableDefinition';

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
// 7. UTILS & HELPERS
// ========================================
// Table Converter
export {
  convertTableDefinition,
  getColumnVisibility,
  getSearchableColumns,
} from './model/TableConverter';

// Helper Functions (falls vorhanden)
export { createSkeletonData, createTableConfig, formatColumnLabels } from './utils/tableHelpers';

// ========================================
// 8. PRESETS (falls vorhanden)
// ========================================
export { tablePresets } from './types';
