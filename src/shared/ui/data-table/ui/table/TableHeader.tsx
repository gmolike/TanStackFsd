// ui/table/TableHeader.tsx
import { flexRender } from '@tanstack/react-table';

import { cn } from '~/shared/lib/utils';
import { ShadCnTableHead, ShadCnTableHeader, ShadCnTableRow } from '~/shared/shadcn';

import { useDataTableContext, useDataTableTable } from '../../lib/context';

export const TableHeader = () => {
  const table = useDataTableTable();
  const { props } = useDataTableContext();
  const { stickyHeader, stickyActionColumn } = props || {};

  return (
    <ShadCnTableHeader className={stickyHeader ? 'sticky top-0 z-10 bg-background' : ''}>
      {table.getHeaderGroups().map((headerGroup) => (
        <ShadCnTableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const isActionColumn = header.column.id === 'actions';
            return (
              <ShadCnTableHead
                key={header.id}
                className={cn(
                  isActionColumn && stickyActionColumn && 'sticky right-0 bg-background shadow-sm',
                )}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </ShadCnTableHead>
            );
          })}
        </ShadCnTableRow>
      ))}
    </ShadCnTableHeader>
  );
};
