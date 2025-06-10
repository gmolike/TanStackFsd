// shared/ui/data-table/components/table-definition.ts

import type { CellTemplateName } from '../components/CellTemplates';

/**
 * Field Definition für eine Tabellen-Spalte
 */
export type FieldDefinition<TData = unknown> = {
  /** Eindeutige ID der Spalte */
  id: string;

  /** Accessor für den Wert (optional, default: id als key) */
  accessor?: string | ((row: TData) => unknown);

  /** Ist die Spalte sortierbar? */
  sortable?: boolean;

  /** Ist die Spalte durchsuchbar? */
  searchable?: boolean;

  /** Ist die Spalte filterbar? */
  filterable?: boolean;

  /** Standard-Sichtbarkeit */
  defaultVisible?: boolean;

  /** Header-Typ */
  headerType?: 'simple' | 'sortable' | 'filterable';

  /** Cell Template Name (nutzt vordefinierte Templates) */
  cellTemplate?: CellTemplateName;

  /** Custom Cell Component */
  cellComponent?: React.ComponentType<any>;

  /** Props für Cell Component */
  cellProps?: (value: unknown, row: TData) => Record<string, unknown>;

  /** Breite der Spalte */
  width?: number | string;
};

/**
 * Komplette Table Definition
 */
export type TableDefinition<TData = unknown> = {
  /** Labels für alle Spalten */
  labels: Record<string, string>;

  /** Feld-Definitionen */
  fields: Array<FieldDefinition<TData>>;
};

/**
 * Props für die DataTable mit neuer Struktur
 */
export type DataTableProps<TData = unknown> = {
  /** Table Definition mit Labels und Fields */
  tableDefinition: TableDefinition<TData>;

  /** Welche Spalten sollen angezeigt werden */
  selectableColumns?: Array<string>;

  /** Daten */
  data: Array<TData>;

  /** Loading State */
  isLoading?: boolean;

  /** Error State */
  error?: Error | null;

  /** Callbacks */
  onRowClick?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onAdd?: () => void;
  onRetry?: () => void;

  /** UI Options */
  searchPlaceholder?: string;
  addButtonText?: string;
  showColumnToggle?: boolean;
  showColumnToggleText?: boolean;

  /** Features */
  expandable?: boolean;
  initialRowCount?: number;
  expandButtonText?: {
    expand?: string;
    collapse?: string;
  };
  stickyHeader?: boolean;
  maxHeight?: string;
  pageSize?: number;
  selectedRowId?: string | null;

  /** Styling */
  className?: string;
  containerClassName?: string;

  /** Custom Components */
  emptyStateComponent?: React.ComponentType;
  errorStateComponent?: React.ComponentType<{ error: Error; onRetry?: () => void }>;
};
