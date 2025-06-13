// ui/table/TableContainer.tsx
import { flexRender } from '@tanstack/react-table';

import { cn } from '~/shared/lib/utils';
import {
  ShadCnTable,
  ShadCnTableBody,
  ShadCnTableCell,
  ShadCnTableHead,
  ShadCnTableHeader,
  ShadCnTableRow,
} from '~/shared/shadcn';

import { useDataTableContext } from '../DataTableProvider';

export const TableContainer = () => {
  const controller = useDataTableContext();
  const { table, displayRows, callbacks, ui } = controller;

  // Props von der originalen DataTable
  const props = controller.props || {};
  const {
    stickyHeader,
    stickyActionColumn,
    maxHeight,
    containerClassName,
    idKey = 'id',
    selectedId,
    selectedRowId,
  } = props;

  return (
    <div
      className={cn(
        'overflow-auto rounded-md border',
        stickyHeader && 'relative',
        containerClassName,
      )}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <ShadCnTable>
        <ShadCnTableHeader className={stickyHeader ? 'sticky top-0 z-10 bg-background' : ''}>
          {table.getHeaderGroups().map((headerGroup) => (
            <ShadCnTableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isActionColumn = header.column.id === 'actions';
                return (
                  <ShadCnTableHead
                    key={header.id}
                    className={cn(
                      isActionColumn &&
                        stickyActionColumn &&
                        'sticky right-0 bg-background shadow-sm',
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

        <ShadCnTableBody>
          {displayRows.length > 0 ? (
            displayRows.map((row) => {
              const rowOriginal = row.original;
              const rowId = String(rowOriginal[idKey] ?? '');
              const isSelected = selectedRowId === rowId || selectedId === rowOriginal[idKey];

              return (
                <ShadCnTableRow
                  key={row.id}
                  data-row-id={rowId}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => callbacks.onRowClick?.(row.original)}
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
                          isActionColumn &&
                            stickyActionColumn &&
                            'sticky right-0 bg-background shadow-sm',
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </ShadCnTableCell>
                    );
                  })}
                </ShadCnTableRow>
              );
            })
          ) : (
            <ShadCnTableRow>
              <ShadCnTableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-muted-foreground"
              >
                Keine Ergebnisse gefunden.
              </ShadCnTableCell>
            </ShadCnTableRow>
          )}
        </ShadCnTableBody>
      </ShadCnTable>
    </div>
  );
};
