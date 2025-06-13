// shared/ui/data-table/model/table-definition.ts

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

  /**
   * Cell Component, "default" für Standard-Text oder "actions" für Action-Buttons
   * Wenn nicht gesetzt, wird Text-Component verwendet
   */
  cell?: React.ComponentType<{ value: unknown; row: TData }> | 'default' | 'actions';

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
 * Extrahiert die Field IDs aus einer TableDefinition
 */
export type ExtractFieldIds<T extends TableDefinition<any>> =
  T extends TableDefinition<infer _> ? T['fields'][number]['id'] : never;

/**
 * Props für die DataTable mit neuer Struktur
 */
export type DataTableProps<
  TData = unknown,
  TTableDef extends TableDefinition<TData> = TableDefinition<TData>,
> = {
  /** Table Definition mit Labels und Fields */
  tableDefinition: TTableDef;

  /** Welche Spalten sollen angezeigt werden - type-safe basierend auf TableDefinition */
  selectableColumns?: Array<ExtractFieldIds<TTableDef>>;

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
  stickyActionColumn?: boolean;
  maxHeight?: string;
  pageSize?: number;
  selectedRowId?: string | null;
  selectedId?: unknown;
  idKey?: string;

  /** Styling */
  className?: string;
  containerClassName?: string;

  /** Custom Components */
  emptyStateComponent?: React.ComponentType;
  errorStateComponent?: React.ComponentType<{ error: Error; onRetry?: () => void }>;
};
