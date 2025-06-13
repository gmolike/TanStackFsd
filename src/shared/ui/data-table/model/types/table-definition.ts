/**
 * Cell Component Props
 */
export type CellComponentProps<TData = unknown> = {
  value: unknown;
  row: TData;
};

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
  cell?: React.ComponentType<CellComponentProps<TData>> | 'default' | 'actions';

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
export type ExtractFieldIds<T> = T extends TableDefinition ? T['fields'][number]['id'] : never;
