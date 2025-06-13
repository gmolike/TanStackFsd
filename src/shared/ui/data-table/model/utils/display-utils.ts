import type { Row, Table } from '@tanstack/react-table';

import type { DataTableProps } from '../types/props';

interface DisplayState {
  isExpanded: boolean;
}

/**
 * Berechnet die anzuzeigenden Rows basierend auf dem State
 */
export const computeDisplayRows = <TData extends Record<string, unknown>>(
  table: Table<TData>,
  state: DisplayState,
  props: DataTableProps<TData, any>,
): Array<Row<TData>> => {
  const allRows = table.getFilteredRowModel().rows;
  const sortedRows = table.getSortedRowModel().rows;
  const paginatedRows = table.getPaginationRowModel().rows;

  // Wenn expandable und nicht expandiert
  if (props.expandable && !state.isExpanded) {
    // Nutze die ersten X der SORTIERTEN Rows
    return sortedRows.slice(0, props.initialRowCount || 5);
  }

  // Normal: Nutze paginierte Rows
  return paginatedRows;
};

/**
 * Berechnet ob der Expand Button angezeigt werden soll
 */
export const shouldShowExpandButton = <TData extends Record<string, unknown>>(
  table: Table<TData>,
  props: DataTableProps<TData, any>,
): boolean => {
  if (!props.expandable) return false;

  const filteredCount = table.getFilteredRowModel().rows.length;
  const initialCount = props.initialRowCount ?? 5;

  return filteredCount > initialCount;
};

/**
 * Findet die Seite auf der sich eine bestimmte Row befindet
 */
export const findRowPage = <TData extends Record<string, unknown>>(
  data: Array<TData>,
  rowId: unknown,
  idKey: string,
  pageSize: number,
): number => {
  const rowIndex = data.findIndex((row) => row[idKey] === rowId);

  if (rowIndex === -1) return 0;

  return Math.floor(rowIndex / pageSize);
};
