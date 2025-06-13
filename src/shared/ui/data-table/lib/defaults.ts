// lib/defaults.ts
import type { DataTableProps } from '../model/types/props';
import type { TableDefinition } from '../model/types/table-definition';

import { DEFAULT_FEATURES, DEFAULT_INITIAL_ROW_COUNT, DEFAULT_PAGE_SIZE } from './constants';

/**
 * Default Table Configuration
 * @template TData - Der Datentyp für die Tabelle
 * @template TTableDef - Die Table Definition
 */
export const createDefaultTableConfig = <
  TData extends Record<string, unknown> = Record<string, unknown>,
  TTableDef extends TableDefinition<TData> = TableDefinition<TData>,
>(): Partial<DataTableProps<TData, TTableDef>> => ({
  pageSize: DEFAULT_PAGE_SIZE,
  showColumnToggle: DEFAULT_FEATURES.columnToggle,
  searchPlaceholder: 'Suchen...',
  stickyHeader: DEFAULT_FEATURES.stickyHeader,
  stickyActionColumn: DEFAULT_FEATURES.stickyActionColumn,
  expandable: DEFAULT_FEATURES.expandable,
  initialRowCount: DEFAULT_INITIAL_ROW_COUNT,
  idKey: 'id',
});

/**
 * Default Column Configuration
 */
export const defaultColumnConfig = {
  sortable: true,
  searchable: false,
  filterable: false,
  defaultVisible: true,
};

/**
 * Default Expand Button Text
 */
export const defaultExpandButtonText = {
  expand: 'Alle {count} Einträge anzeigen',
  collapse: 'Weniger anzeigen',
};

/**
 * Default Error Messages
 */
export const defaultErrorMessages = {
  loadError: 'Fehler beim Laden der Daten',
  deleteError: 'Fehler beim Löschen',
  updateError: 'Fehler beim Aktualisieren',
  createError: 'Fehler beim Erstellen',
};

/**
 * Preset Configurations für verschiedene Use Cases
 */
export const tablePresets = {
  /** Einfache Tabelle mit Basis-Features */
  simple: {
    showColumnToggle: false,
    pageSize: 10,
    stickyHeader: false,
  },

  /** Erweiterte Tabelle mit allen Features */
  advanced: {
    showColumnToggle: true,
    pageSize: 20,
    stickyHeader: true,
    stickyActionColumn: true,
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

  /** Große Datentabelle */
  large: {
    showColumnToggle: true,
    pageSize: 50,
    stickyHeader: true,
    maxHeight: '80vh',
  },
};

/**
 * Type für Preset Namen
 */
export type TablePresetName = keyof typeof tablePresets;

/**
 * Type für Preset Configuration
 */
export type TablePresetConfig = (typeof tablePresets)[TablePresetName];

/**
 * Merge Configurations Helper
 * @template TData - Der Datentyp für die Tabelle
 * @template TTableDef - Die Table Definition
 */
export const mergeTableConfig = <
  TData extends Record<string, unknown> = Record<string, unknown>,
  TTableDef extends TableDefinition<TData> = TableDefinition<TData>,
>(
  preset: TablePresetName | undefined,
  overrides?: Partial<DataTableProps<TData, TTableDef>>,
): Partial<DataTableProps<TData, TTableDef>> => {
  const defaultConfig = createDefaultTableConfig<TData, TTableDef>();
  const baseConfig = preset ? tablePresets[preset] : {};

  return {
    ...defaultConfig,
    ...baseConfig,
    ...overrides,
  };
};
