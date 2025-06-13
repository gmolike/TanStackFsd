import { createContext, useContext } from 'react';

const DataTableContext = createContext<any>(null);

export const DataTableProvider = ({ children, value }: any) => (
  <DataTableContext.Provider value={value}>{children}</DataTableContext.Provider>
);

export const useDataTableContext = () => {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTableContext must be used within DataTableProvider');
  }
  return context;
};
