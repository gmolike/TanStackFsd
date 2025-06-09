// src/shared/ui/expandable-data-table/expandable-data-table.tsx
import { useState } from 'react';

import type { SortingState, VisibilityState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cn } from '~/shared/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/shared/shadcn';
import { DataTablePagination, DataTableToolbar } from '~/shared/ui/data-table';

import { ExpandButton } from './expand-button';
import type { ExpandableDataTableProps } from './types';

/**
 * Erweiterbare DataTable mit allen Features
 * @component
 */
export function ExpandableDataTable<TData, TValue>({
  columns,
  data,
  initialRowCount = 3,
  onRowClick,
  className,
  containerClassName,
  searchPlaceholder = 'Globale Suche...',
  columnLabels,
  showColumnToggle = true,
  onAddClick,
  addButtonText,
  defaultColumnVisibility,
}: ExpandableDataTableProps<TData, TValue>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility || {},
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    // Initiale pageSize basierend auf expanded state
    initialState: {
      pagination: {
        pageSize: isExpanded ? 10 : initialRowCount,
      },
    },
  });

  // Wichtig: pageSize anpassen wenn expanded state sich ändert
  const handleToggleExpand = () => {
    if (isExpanded) {
      // Beim Kollabieren: zurück auf initialRowCount
      table.setPageSize(initialRowCount);
      table.setPageIndex(0);
      setIsExpanded(false);
    } else {
      // Beim Expandieren: Standard pageSize (10)
      table.setPageSize(10);
      setIsExpanded(true);
    }
  };

  // Nur im collapsed state die Anzahl der Zeilen begrenzen
  const displayedRows = table.getRowModel().rows;
  const rowsToShow = isExpanded ? displayedRows : displayedRows.slice(0, initialRowCount);

  const totalFilteredRows = table.getFilteredRowModel().rows.length;
  const showExpandButton = totalFilteredRows > initialRowCount;

  return (
    <div className={cn('space-y-4', className)}>
      <DataTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        columnLabels={columnLabels}
        showColumnToggle={showColumnToggle}
        showColumnToggleText={false}
        onAddClick={onAddClick}
        addButtonText={addButtonText}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />

      <div className={cn('overflow-auto', containerClassName)}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rowsToShow.length ? (
                rowsToShow.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Keine Ergebnisse.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {isExpanded ? (
        <>
          <DataTablePagination table={table} />
          {showExpandButton && (
            <ExpandButton
              isExpanded={isExpanded}
              onToggle={handleToggleExpand}
              collapsedCount={initialRowCount}
              totalCount={totalFilteredRows}
            />
          )}
        </>
      ) : (
        showExpandButton && (
          <ExpandButton
            isExpanded={isExpanded}
            onToggle={handleToggleExpand}
            collapsedCount={initialRowCount}
            totalCount={totalFilteredRows}
          />
        )
      )}
    </div>
  );
}
