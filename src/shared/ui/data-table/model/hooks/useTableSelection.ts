import { useState } from 'react';

import type { OnChangeFn, RowSelectionState, Updater } from '@tanstack/react-table';

import type { DataTableProps } from '../types/props';
import type { TableDefinition } from '../types/table-definition';

export interface TableSelectionReturn {
  state: {
    rowSelection: RowSelectionState;
  };
  setRowSelection: OnChangeFn<RowSelectionState>;
  selectedCount: number;
  isAllSelected: boolean;
  toggleAllRowsSelected: (value?: boolean) => void;
}

export const useTableSelection = <
  TData extends Record<string, unknown>,
  TTableDef extends TableDefinition<TData>,
>(
  props: DataTableProps<TData, TTableDef>,
): TableSelectionReturn => {
  const [rowSelection, setRowSelectionState] = useState<RowSelectionState>({});

  // Type-safe row selection setter
  const setRowSelection: OnChangeFn<RowSelectionState> = (
    updaterOrValue: Updater<RowSelectionState>,
  ) => {
    if (typeof updaterOrValue === 'function') {
      setRowSelectionState((prev) => updaterOrValue(prev));
    } else {
      setRowSelectionState(updaterOrValue);
    }
  };

  const selectedCount = Object.keys(rowSelection).filter((key) => rowSelection[key]).length;
  const isAllSelected = selectedCount > 0 && selectedCount === props.data.length;

  const toggleAllRowsSelected = (value?: boolean) => {
    if (value === undefined) {
      setRowSelectionState(
        isAllSelected ? {} : props.data.reduce((acc, _, index) => ({ ...acc, [index]: true }), {}),
      );
    } else {
      setRowSelectionState(
        value ? props.data.reduce((acc, _, index) => ({ ...acc, [index]: true }), {}) : {},
      );
    }
  };

  return {
    state: { rowSelection },
    setRowSelection,
    selectedCount,
    isAllSelected,
    toggleAllRowsSelected,
  };
};
