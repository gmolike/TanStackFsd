// src/shared/ui/data-table/types.ts
import type {
  ColumnDef,
  SortingState,
  Table as TanstackTable,
  VisibilityState,
} from '@tanstack/react-table';

/**
 * Row Selection State Type
 */
export type RowSelectionState = Record<string, boolean>;

/**
 * Base constraint for table data
 */
export interface TableDataConstraint {
  id?: string;
}

/**
 * Basis-Props die alle Table-Varianten teilen
 */
export interface BaseDataTableProps<TData extends TableDataConstraint, TValue = unknown> {
  /** Spalten-Definitionen für die Tabelle */
  columns: Array<ColumnDef<TData, TValue>>;

  /** Daten-Array für die Tabelle */
  data: Array<TData>;

  /** Placeholder-Text für das Suchfeld */
  searchPlaceholder?: string;

  /** Key für die Suche (deprecated - nutzt global filter) */
  searchKey?: string;

  /** Callback wenn eine Zeile angeklickt wird */
  onRowClick?: (row: TData) => void;

  /** CSS-Klasse für den Wrapper */
  className?: string;

  /** CSS-Klasse für den Table-Container */
  containerClassName?: string;

  /** Standard-Sortierung beim ersten Laden */
  defaultSorting?: SortingState;

  /** Standard-Spalten-Sichtbarkeit */
  defaultColumnVisibility?: VisibilityState;

  /** Anzahl der Zeilen pro Seite */
  pageSize?: number;

  /** Ob die Spaltenauswahl angezeigt werden soll */
  showColumnToggle?: boolean;

  /** Ob der Text beim Spalten-Button angezeigt werden soll */
  showColumnToggleText?: boolean;

  /** Callback für den Plus-Button */
  onAddClick?: () => void;

  /** Text für den Plus-Button */
  addButtonText?: string;

  /** Labels für die Spalten (für Anzeige in UI) */
  columnLabels?: Record<string, string>;

  /** Liste der durchsuchbaren Spalten */
  searchableColumns?: Array<string>;

  /** ID der aktuell ausgewählten Zeile (für visuelle Hervorhebung) */
  selectedRowId?: string | null;
}

/**
 * Feature-Flags für verschiedene Table-Varianten
 */
export interface DataTableFeatures {
  /** Aktiviert Skeleton-Loading */
  withSkeleton?: boolean;

  /** Zeigt Loading-State an */
  isLoading?: boolean;

  /** Anzahl der Skeleton-Zeilen */
  skeletonRows?: number;

  /** Aktiviert Expand/Collapse Feature */
  expandable?: boolean;

  /** Anzahl der initial angezeigten Zeilen (bei expandable) */
  initialRowCount?: number;

  /** Texte für Expand/Collapse Button */
  expandButtonText?: {
    expand?: string;
    collapse?: string;
  };

  /** Aktiviert Zeilen-Selektion */
  enableRowSelection?: boolean;

  /** Aktiviert globale Suche */
  enableGlobalFilter?: boolean;

  /** Macht den Header sticky */
  stickyHeader?: boolean;

  /** Höhenbeschränkung für die Tabelle */
  maxHeight?: string;
}

/**
 * Vollständige Props für DataTable
 */
export interface DataTableProps<TData extends TableDataConstraint, TValue = unknown>
  extends BaseDataTableProps<TData, TValue>,
    DataTableFeatures {
  /** Error-State */
  error?: Error | null;

  /** Retry-Callback bei Fehler */
  onRetry?: () => void;

  /** Custom Empty-State Komponente */
  emptyStateComponent?: React.ComponentType;

  /** Custom Error-State Komponente */
  errorStateComponent?: React.ComponentType<{ error: Error; onRetry?: () => void }>;
}

/**
 * Props für Toolbar-Komponente
 */
export interface ToolbarProps<TData> {
  /** TanStack Table Instanz */
  table: TanstackTable<TData>;

  /** Aktueller globaler Filter-Wert */
  globalFilter?: string;

  /** Callback für globale Filter-Änderung */
  onGlobalFilterChange?: (value: string) => void;

  /** Placeholder für Suchfeld */
  searchPlaceholder?: string;

  /** Spalten-Labels für Anzeige */
  columnLabels?: Record<string, string>;

  /** Zeigt Spalten-Toggle */
  showColumnToggle?: boolean;

  /** Zeigt Text bei Spalten-Toggle */
  showColumnToggleText?: boolean;

  /** Callback für Add-Button */
  onAddClick?: () => void;

  /** Text für Add-Button */
  addButtonText?: string;

  /** Liste der durchsuchbaren Spalten */
  searchableColumns?: Array<string>;
}

/**
 * Props für Pagination-Komponente
 */
export interface PaginationProps<TData> {
  /** TanStack Table Instanz */
  table: TanstackTable<TData>;
}

/**
 * Props für Expand-Button
 */
export interface ExpandButtonProps {
  /** Ist die Tabelle expandiert? */
  isExpanded: boolean;

  /** Toggle-Callback */
  onToggle: () => void;

  /** Anzahl der Zeilen im kollabierten Zustand */
  collapsedCount: number;

  /** Gesamtanzahl der Zeilen */
  totalCount: number;

  /** Custom Texte */
  customText?: {
    expand?: string;
    collapse?: string;
  };
}

/**
 * Skeleton Props
 */
export interface TableSkeletonProps<TData = unknown, TValue = unknown> {
  /** Spalten-Definitionen für Struktur */
  columns: Array<ColumnDef<TData, TValue>>;

  /** Anzahl der Skeleton-Zeilen */
  rows?: number;

  /** Zeigt Toolbar-Skeleton */
  showToolbar?: boolean;

  /** Zeigt Pagination-Skeleton */
  showPagination?: boolean;
}

/**
 * Preset-Konfigurationen für häufige Use-Cases
 */
export const tablePresets = {
  /** Einfache Tabelle mit Basis-Features */
  simple: {
    showColumnToggle: false,
    enableGlobalFilter: true,
    pageSize: 10,
  },

  /** Erweiterte Tabelle mit allen Features */
  advanced: {
    showColumnToggle: true,
    enableGlobalFilter: true,
    enableRowSelection: true,
    pageSize: 20,
  },

  /** Dashboard-Tabelle mit Expand-Feature */
  dashboard: {
    expandable: true,
    initialRowCount: 3,
    showColumnToggle: false,
    pageSize: 10,
  },

  /** Kompakte Tabelle für kleine Bereiche */
  compact: {
    showColumnToggle: false,
    pageSize: 5,
    maxHeight: '400px',
  },
} as const;

/**
 * Type Guards with proper type constraints
 */
export const isExpandable = <TData extends TableDataConstraint, TValue>(
  props: DataTableProps<TData, TValue>,
): boolean => !!props.expandable && typeof props.initialRowCount === 'number';

export const hasError = <TData extends TableDataConstraint, TValue>(
  props: DataTableProps<TData, TValue>,
): props is DataTableProps<TData, TValue> & { error: Error } => !!props.error;

export const isLoading = <TData extends TableDataConstraint, TValue>(
  props: DataTableProps<TData, TValue>,
): boolean => !!props.withSkeleton && !!props.isLoading;
