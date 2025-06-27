/**
 * Extrahiert alle Keys aus einem Type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractedKey<T> = T extends Record<string, any> ? keyof T & string : never;

/**
 * Field Definition für eine Tabellen-Spalte mit Type-Safety
 */
export type FieldDefinition<TData = unknown, TFieldId extends string = string> = {
  /** Eindeutige ID der Spalte - muss ein Key aus TData oder "actions" sein */
  id: TFieldId;

  /** Accessor für den Wert (optional, default: id als key) */
  accessor?: TFieldId extends 'actions' ? never : TFieldId | ((row: TData) => unknown);

  /** Ist die Spalte sortierbar? */
  sortable?: boolean;

  /** Ist die Spalte durchsuchbar? */
  searchable?: boolean;

  /** Ist die Spalte ausblendbar */
  toggelable?: boolean;

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
 * Komplette Table Definition mit Type-Safety
 */
export type TableDefinition<TData = unknown> = {
  /** Labels für alle Spalten - Keys müssen mit Fields übereinstimmen */
  labels: Record<ExtractedKey<TData> | 'actions', string>;

  /** Feld-Definitionen - nur erlaubte Field IDs */
  fields: Array<FieldDefinition<TData, ExtractedKey<TData> | 'actions'>>;
};

/**
 * Helper Type für bessere Inference
 */
export type CreateTableDefinition<TData> = (
  definition: TableDefinition<TData>,
) => TableDefinition<TData>;

/**
 * Factory Funktion für Type-Safe Table Definitions
 *
 * @example
 * ```tsx
 * interface TeamMember {
 *   id: string;
 *   firstName: string;
 *   lastName: string;
 *   email: string;
 *   status: 'active' | 'inactive';
 * }
 *
 * const teamTableDefinition = createTableDefinition<TeamMember>({
 *   labels: {
 *     firstName: 'Vorname',
 *     lastName: 'Nachname',
 *     email: 'E-Mail',
 *     status: 'Status',
 *     actions: 'Aktionen', // Special case
 *   },
 *   fields: [
 *     {
 *       id: 'firstName', // Type-safe! Muss ein Key aus TeamMember sein
 *       sortable: true,
 *     },
 *     {
 *       id: 'actions', // Oder "actions"
 *       cell: 'actions',
 *     },
 *     // {
 *     //   id: 'wrongKey', // TypeScript Error!
 *     // }
 *   ],
 * });
 * ```
 */
export const createTableDefinition = <TData>(
  definition: TableDefinition<TData>,
): TableDefinition<TData> => definition;

/**
 * Extrahiert die Field IDs aus einer TableDefinition

 */
export type ExtractedFieldId<TTableDef> = TTableDef extends {
  fields: ReadonlyArray<{ id: infer TId }>;
}
  ? TId
  : never;
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
  selectableColumns?: Array<ExtractedFieldId<TTableDef>>;
  disabledColumns?: Array<ExtractedFieldId<TTableDef>>;
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
  addButtonTitle?: string;
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
  selectedId?: string;
  idKey?: keyof TData;

  /** Styling */
  className?: string;
  containerClassName?: string;

  /** Custom Components */
  emptyStateComponent?: React.ComponentType;
  errorStateComponent?: React.ComponentType<{ error: Error; onRetry?: () => void }>;
};
