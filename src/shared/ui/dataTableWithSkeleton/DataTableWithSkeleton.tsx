import React from 'react';
import type { JSX } from 'react';

import type { CustomColumnDef } from '~/shared/ui/shadcn';
import { DataTable, DataTableSkeleton } from '~/shared/ui/shadcn';

// Typen für DataTable Props aus ShadCN extrahieren
export type DataTableProps<TData, TValue> = React.ComponentProps<typeof DataTable<TData, TValue>>;

type Props<TData, TValue = unknown> = {
  isLoading: boolean;
  data: Array<TData>;
  columns: Array<CustomColumnDef<TData, TValue>>;
} & Omit<DataTableProps<TData, TValue>, 'data' | 'columns'>;

const DataTableWithSkeleton = <TData, TValue = unknown>({
  isLoading,
  data,
  columns,
  ...props
}: Props<TData, TValue>): JSX.Element => {
  if (isLoading) {
    return <DataTableSkeleton columnDef={columns} numRows={10} />;
  }

  return <DataTable columns={columns} data={data} {...props} />;
};

export default DataTableWithSkeleton;
