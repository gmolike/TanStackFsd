import { DataTableProvider as Provider, useDataTableContext } from '../lib/context';

// Re-export from lib/context
export { Provider as DataTableProvider, useDataTableContext };

// Re-export types for convenience
export type { DataTableContextValue, DataTableProviderProps } from '../lib/context';
