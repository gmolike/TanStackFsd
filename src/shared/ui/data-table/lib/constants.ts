// lib/constants.ts

/**
 * Table Pagination Constants
 */
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];

/**
 * Table Display Constants
 */
export const DEFAULT_INITIAL_ROW_COUNT = 5;
export const DEFAULT_SKELETON_ROWS = 10;
export const DEFAULT_DEBOUNCE_MS = 300;

/**
 * Table Feature Defaults
 */
export const DEFAULT_FEATURES = {
  sorting: true,
  filtering: true,
  pagination: true,
  columnToggle: true,
  globalSearch: true,
  expandable: false,
  selection: false,
  stickyHeader: false,
  stickyActionColumn: false,
};

/**
 * Column Width Constants
 */
export const COLUMN_WIDTHS = {
  checkbox: 40,
  actions: 100,
  icon: 50,
  small: 100,
  medium: 200,
  large: 300,
};

/**
 * Z-Index Layers
 */
export const Z_INDEX = {
  tableHeader: 10,
  stickyColumn: 20,
  dropdown: 50,
  modal: 100,
};

/**
 * Animation Durations
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

/**
 * Table Text Constants
 */
export const TABLE_TEXT = {
  empty: 'Keine Daten vorhanden',
  noResults: 'Keine Ergebnisse gefunden',
  loading: 'Lade Daten...',
  error: 'Fehler beim Laden der Daten',
  search: 'Suchen...',
  pageOf: 'Seite {current} von {total}',
  rowsPerPage: 'Zeilen pro Seite',
  selectedRows: '{count} ausgewählt',
};

/**
 * Type für Page Size Options
 */
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

/**
 * Type für Feature Names
 */
export type FeatureName = keyof typeof DEFAULT_FEATURES;

/**
 * Type für Column Width Keys
 */
export type ColumnWidthKey = keyof typeof COLUMN_WIDTHS;
