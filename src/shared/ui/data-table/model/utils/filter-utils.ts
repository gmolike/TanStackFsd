// model/utils/filter-utils.ts
import type { Row } from '@tanstack/react-table';

/**
 * Global Filter Function für die Tabelle
 */
export const globalFilterFn = <TData extends Record<string, unknown>>(
  row: Row<TData>,
  columnId: string,
  filterValue: string,
  searchableColumns?: Array<string>,
): boolean => {
  if (!filterValue) return true;

  const search = filterValue.toLowerCase();

  if (searchableColumns && searchableColumns.length > 0) {
    return searchableColumns.some((column) => {
      const value = row.getValue(column);
      return String(value).toLowerCase().includes(search);
    });
  }

  // Fallback: Durchsuche alle Werte
  const values = row.getAllCells().map((cell) => cell.getValue());
  return values.some((value) => String(value).toLowerCase().includes(search));
};

/**
 * Column Filter Function
 */
export const columnFilterFn = <TData extends Record<string, unknown>>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown,
): boolean => {
  const value = row.getValue(columnId);

  // Array filter (für Multiple Select)
  if (Array.isArray(filterValue)) {
    return filterValue.includes(value);
  }

  // String filter
  if (typeof filterValue === 'string') {
    return String(value).toLowerCase().includes(filterValue.toLowerCase());
  }

  // Exact match
  return value === filterValue;
};
