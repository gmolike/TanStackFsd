import type { HeaderGroup, Row } from '@tanstack/react-table';
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

import { useDataTableContext } from '../../lib/context';

export const TableContainer = () => {
  const { table, displayRows, callbacks, props } = useDataTableContext();
  const {
    stickyHeader,
    stickyActionColumn,
    maxHeight,
    containerClassName,
    idKey = 'id',
    selectedId,
    selectedRowId,
  } = props || {};

  // Verwende immer displayRows, da diese bereits die korrekte Logik enthalten
  const rows = displayRows;

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
        <ShadCnTableHeader
          className={cn(stickyHeader && 'sticky top-0 z-10 bg-background', 'bg-muted/50')}
        >
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<Record<string, unknown>>) => (
            <ShadCnTableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isActionColumn = header.column.id === 'actions';
                return (
                  <ShadCnTableHead
                    key={header.id}
                    className={cn(
                      'px-4 py-3', // Mehr Padding für Header
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
          {rows.length > 0 ? (
            rows.map((row: Row<Record<string, unknown>>) => {
              const rowOriginal = row.original;
              const rowId = String(rowOriginal[idKey] ?? '');
              const isSelected = selectedRowId === rowId || selectedId === rowOriginal[idKey];

              return (
                <ShadCnTableRow
                  key={`${row.id}-${row.original[idKey]}`} // Besserer Key für Re-Render
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
                          'px-4 py-3', // Mehr Padding für Cells
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
