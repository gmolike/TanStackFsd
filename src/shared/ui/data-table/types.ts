// src/shared/ui/data-table/types.ts
import type { SortingState, VisibilityState } from '@tanstack/react-table';

/**
 * Konfiguration für DataTable Standard-Einstellungen
 */
export interface DataTableConfig {
  /**
   * Standard-Sortierung beim ersten Laden
   * @example [{ id: 'name', desc: false }]
   */
  defaultSorting?: SortingState;

  /**
   * Standard-Spalten-Sichtbarkeit
   * @example { name: true, email: true, phone: false }
   */
  defaultColumnVisibility?: VisibilityState;

  /**
   * Anzahl der Zeilen pro Seite
   * @default 10
   */
  pageSize?: number;

  /**
   * Ob Zeilen beim Klick ausgewählt werden sollen
   * @default false
   */
  enableRowSelection?: boolean;

  /**
   * Ob die Spaltenauswahl angezeigt werden soll
   * @default true
   */
  showColumnToggle?: boolean;

  /**
   * Labels für die Spalten (für generische Anzeige)
   */
  columnLabels?: Record<string, string>;

  /**
   * Placeholder für das Suchfeld
   */
  searchPlaceholder?: string;
}

/**
 * Vordefinierte Konfigurationen für verschiedene Tabellen
 */
export const tableConfigs = {
  team: {
    defaultSorting: [{ id: 'name', desc: false }],
    defaultColumnVisibility: {
      name: true,
      email: true,
      role: true,
      department: true,
      phone: false,
      status: true,
      actions: true,
    },
    pageSize: 10,
    showColumnToggle: true,
    searchPlaceholder: 'Nach Namen, E-Mail oder Rolle suchen...',
    columnLabels: {
      name: 'Name',
      email: 'E-Mail',
      role: 'Rolle',
      department: 'Abteilung',
      phone: 'Telefon',
      status: 'Status',
      birthDate: 'Geburtsdatum',
      startDate: 'Eintrittsdatum',
      newsletter: 'Newsletter',
      remoteWork: 'Remote-Arbeit',
    },
  },
  article: {
    defaultSorting: [{ id: 'articleNumber', desc: false }],
    defaultColumnVisibility: {
      articleNumber: true,
      name: true,
      category: true,
      price: true,
      stock: true,
      status: true,
      actions: true,
    },
    pageSize: 20,
    showColumnToggle: true,
    searchPlaceholder: 'Nach Artikelnummer oder Name suchen...',
    columnLabels: {
      articleNumber: 'Art.-Nr.',
      name: 'Name',
      category: 'Kategorie',
      subcategory: 'Unterkategorie',
      price: 'Preis',
      stock: 'Bestand',
      minStock: 'Mindestbestand',
      unit: 'Einheit',
      status: 'Status',
      manufacturer: 'Hersteller',
      supplier: 'Lieferant',
    },
  },
} as const satisfies Record<string, DataTableConfig>;
