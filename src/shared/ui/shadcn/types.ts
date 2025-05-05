import type { ColumnDef } from '@tanstack/react-table';

// Erweitert die ColumnDef-Typen von TanStack Table
export type CustomColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  // Hier kannst du zusätzliche Properties für deine Custom Column Definition hinzufügen
  searchable?: boolean;
  sortable?: boolean;
  exportable?: boolean;
  // etc.
};
