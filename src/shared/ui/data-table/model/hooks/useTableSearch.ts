import { useState } from 'react';

import type { OnChangeFn, Updater } from '@tanstack/react-table';

import type { DataTableProps } from '../types/props';
import type { TableDefinition } from '../types/table-definition';

import type { TableStateReturn } from './useTableState';

export interface TableSearchReturn {
  state: {
    globalFilter: string;
  };
  setGlobalFilter: OnChangeFn<string>;
  searchableColumns: Array<string>;
}

export const useTableSearch = <
  TData extends Record<string, unknown>,
  TTableDef extends TableDefinition<TData>,
>(
  props: DataTableProps<TData, TTableDef>,
  state: TableStateReturn,
  props: DataTableProps<TData, TTableDef>,
): TableSearchReturn => {
  const [globalFilter, setGlobalFilterState] = useState('');

  // Extrahiere searchable columns aus der table definition
  const searchableColumns = props.tableDefinition.fields
    .filter((field) => field.searchable === true)
    .map((field) => field.id);

  // Type-safe global filter setter
  const setGlobalFilter: OnChangeFn<string> = (updaterOrValue: Updater<string>) => {
    if (typeof updaterOrValue === 'function') {
      setGlobalFilterState((prev) => updaterOrValue(prev));
    } else {
      setGlobalFilterState(updaterOrValue);
    }
  };

  return {
    state: { globalFilter },
    setGlobalFilter,
    searchableColumns,
  };
};
