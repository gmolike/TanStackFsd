import type { ExtractFieldIds, TableDefinition } from './table-definition';

/**
 * Error State Component Props
 */
export type ErrorStateComponentProps = {
  error: Error;
  onRetry?: () => void;
};

/**
 * Props für die DataTable mit neuer Struktur
 */
export type DataTableProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
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
  errorStateComponent?: React.ComponentType<ErrorStateComponentProps>;
};
