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
  // Immer zuerst gefilterte und sortierte Rows holen
  const filteredRows = table.getFilteredRowModel().rows;

  // Wenn expandable und nicht expandiert
  if (props.expandable && !state.isExpanded) {
    // Nutze die ersten X der gefilterten Rows
    return filteredRows.slice(0, props.initialRowCount ?? 5);
  }

  // Wenn expandable und expandiert, zeige alle gefilterten Rows
  if (props.expandable && state.isExpanded) {
    return filteredRows;
  }

  // Wenn nicht expandable, nutze paginierte Rows
  return table.getPaginationRowModel().rows;
};
