import type { Row, Table } from '@tanstack/react-table';

import type { DataTableProps } from '../types/props';
import type { TableDefinition } from '../types/table-definition';

interface DisplayState {
  isExpanded: boolean;
}

/**
 * Berechnet die anzuzeigenden Rows basierend auf dem State
 */
export const computeDisplayRows = <TData extends Record<string, unknown>>(
  table: Table<TData>,
  state: DisplayState,
  props: DataTableProps<TData, TableDefinition<TData>>,
): Array<Row<TData>> => {
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
