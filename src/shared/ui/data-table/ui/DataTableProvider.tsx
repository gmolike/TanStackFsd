import { createContext, useContext } from 'react';

import type { DataTableController } from '../model/hooks/useDataTable';
import type { DataTableProps } from '../model/types/props';

interface DataTableContextValue<TData extends Record<string, unknown> = Record<string, unknown>>
  extends DataTableController<TData> {
  props?: DataTableProps<TData, any>;
}

const DataTableContext = createContext<DataTableContextValue<any> | null>(null);

interface DataTableProviderProps {
  children: React.ReactNode;
  value: DataTableController<any>;
  props?: any;
}

export const DataTableProvider = ({ children, value, props }: DataTableProviderProps) => (
  <DataTableContext.Provider value={{ ...value, props }}>{children}</DataTableContext.Provider>
);

export const useDataTableContext = () => {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTableContext must be used within DataTableProvider');
  }
  return context;
};
