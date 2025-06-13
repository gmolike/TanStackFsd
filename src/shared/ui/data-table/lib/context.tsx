import { createContext, useContext } from 'react';

import type { DataTableController } from '../model/hooks/useDataTable';
import type { DataTableProps } from '../model/types/props';
import type { TableDefinition } from '../model/types/table-definition';

/**
 * Extended Context Value with original props
 * @template TData - Der Datentyp für die Tabelle
 */
export interface DataTableContextValue<
  TData extends Record<string, unknown> = Record<string, unknown>,
> extends DataTableController<TData> {
  // any hier notwendig, da wir die genaue TableDefinition nicht kennen können
  props?: DataTableProps<TData, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * DataTable Context
 * any hier notwendig für die initiale Context-Erstellung
 */
const DataTableContext = createContext<DataTableContextValue<any> | null>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * DataTable Provider Props
 * @template TData - Der Datentyp für die Tabelle
 * @template TTableDef - Die Table Definition
 */
export interface DataTableProviderProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  TTableDef extends TableDefinition<TData> = TableDefinition<TData>,
> {
  children: React.ReactNode;
  value: DataTableController<TData>;
  props?: DataTableProps<TData, TTableDef>;
}

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
      // any hier notwendig wegen Context Type Constraints
      props: props as DataTableProps<TData, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
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

/**
 * Re-export from DataTableProvider
 */
export { DataTableProvider as Provider } from '../ui/DataTableProvider';
