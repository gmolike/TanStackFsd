import { createContext, useContext } from 'react';

import type { DataTableController } from '../model/hooks/useDataTable';
import type { DataTableProps } from '../model/types/props';
import type { TableDefinition } from '../model/types/table-definition';

/**
 * Context Value Type
 * @template TData - Der Datentyp für die Tabelle
 */
export type DataTableContextValue<TData extends Record<string, unknown> = Record<string, unknown>> =
  DataTableController<TData> & {
    props?: DataTableProps<TData, TableDefinition<TData>>;
  };

/**
 * DataTable Context
 */
const DataTableContext = createContext<DataTableContextValue<Record<string, unknown>> | null>(null);

/**
 * DataTable Provider Props Type
 * @template TData - Der Datentyp für die Tabelle
 * @template TTableDef - Die Table Definition
 */
export type DataTableProviderProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TTableDef extends TableDefinition<TData> = TableDefinition<TData>,
> = {
  children: React.ReactNode;
  value: DataTableController<TData>;
  props?: DataTableProps<TData, TTableDef>;
};

/**
 * DataTable Provider Component
 * @template TData - Der Datentyp für die Tabelle
 */
export const DataTableProvider = <
  TData extends Record<string, unknown> = Record<string, unknown>,
  TTableDef extends TableDefinition<TData> = TableDefinition<TData>,
>({
  children,
  value,
  props,
}: DataTableProviderProps<TData, TTableDef>) => (
  <DataTableContext.Provider
    value={{
      ...value,
      props: props as DataTableProps<TData, TableDefinition<TData>>,
    }}
  >
    {children}
  </DataTableContext.Provider>
);

/**
 * Hook to use DataTable Context
 * @template TData - Der Datentyp für die Tabelle
 */
export const useDataTableContext = <
  TData extends Record<string, unknown> = Record<string, unknown>,
>(): DataTableContextValue<TData> => {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTableContext must be used within DataTableProvider');
  }
  return context as DataTableContextValue<TData>;
};

/**
 * Hook to use specific parts of DataTable Context
 */
export const useDataTableState = () => {
  const { state } = useDataTableContext();
  return state;
};

export const useDataTableFeatures = () => {
  const { features } = useDataTableContext();
  return features;
};

export const useDataTableCallbacks = <
  TData extends Record<string, unknown> = Record<string, unknown>,
>() => {
  const { callbacks } = useDataTableContext<TData>();
  return callbacks;
};

export const useDataTableUI = () => {
  const { ui } = useDataTableContext();
  return ui;
};

export const useDataTableTable = <
  TData extends Record<string, unknown> = Record<string, unknown>,
>() => {
  const { table } = useDataTableContext<TData>();
  return table;
};
