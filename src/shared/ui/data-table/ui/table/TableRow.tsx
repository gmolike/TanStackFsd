import type { Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import { cn } from '~/shared/lib/utils';
import { ShadCnTableCell, ShadCnTableRow } from '~/shared/shadcn';

import { useDataTableContext } from '../DataTableProvider';

interface TableRowProps<TData extends Record<string, unknown>> {
  row: Row<TData>;
}

export const TableRow = <TData extends Record<string, unknown>>({ row }: TableRowProps<TData>) => {
  const { callbacks, props } = useDataTableContext();
  const { idKey = 'id', selectedId, selectedRowId, stickyActionColumn } = props ?? {};

  const rowOriginal = row.original;
  const rowIdValue = rowOriginal[idKey];
  let rowId = '';
  if (rowIdValue !== null && typeof rowIdValue === 'object') {
    rowId = JSON.stringify(rowIdValue);
  } else {
    rowId = String(rowIdValue);
  }
  const isSelected = selectedRowId === rowId || selectedId === rowOriginal[idKey];

  return (
    <ShadCnTableRow
      data-row-id={rowId}
      data-state={row.getIsSelected() && 'selected'}
      onClick={() => callbacks.onRowClick?.(rowOriginal)}
      className={cn(
        callbacks.onRowClick ? 'cursor-pointer hover:bg-muted/50' : '',
        isSelected && 'bg-muted/50',
      )}
    >
      {row.getVisibleCells().map((cell) => {
        const isActionColumn = cell.column.id === 'actions';
        return (
          <ShadCnTableCell
            key={cell.id}
            className={cn(
              isActionColumn && stickyActionColumn && 'sticky right-0 bg-background shadow-sm',
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </ShadCnTableCell>
        );
      })}
    </ShadCnTableRow>
  );
};
