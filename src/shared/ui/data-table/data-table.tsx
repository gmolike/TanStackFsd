// src/shared/ui/data-table/data-table.tsx
import { useEffect, useState } from 'react';

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/shared/shadcn';

import { DataTablePagination } from './pagination';
import { DataTableToolbar } from './toolbar';

export interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
  // Standard-Konfigurationen
  defaultSorting?: SortingState;
  defaultColumnVisibility?: VisibilityState;
  pageSize?: number;
  // Column Labels für generische Anzeige
  columnLabels?: Record<string, string>;
  // Ob Spaltenauswahl angezeigt werden soll
  showColumnToggle?: boolean;
  // Ob der Text beim Spalten-Button angezeigt werden soll
  showColumnToggleText?: boolean;
  // Callback für den Plus-Button
  onAddClick?: () => void;
  // Optionaler Text für den Plus-Button
  addButtonText?: string;
}

/**
 * DataTable Component
 * Erweiterte generische Tabellen-Komponente mit Sortierung, Filterung und lokaler Pagination
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Globale Suche...',
  onRowClick,
  defaultSorting = [],
  defaultColumnVisibility = {},
  pageSize = 10,
  columnLabels,
  showColumnToggle = true,
  showColumnToggleText = false,
  onAddClick,
  addButtonText,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  // Debug logging
  useEffect(() => {
    console.log('Table State:', {
      pageIndex: table.getState().pagination.pageIndex,
      pageSize: table.getState().pagination.pageSize,
      pageCount: table.getPageCount(),
      canNextPage: table.getCanNextPage(),
      canPreviousPage: table.getCanPreviousPage(),
      rowsCount: table.getRowModel().rows.length,
      filteredRowsCount: table.getFilteredRowModel().rows.length,
    });
  }, [table.getState().pagination, table.getRowModel().rows.length]);

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        searchPlaceholder={searchPlaceholder}
        columnLabels={columnLabels}
        showColumnToggle={showColumnToggle}
        showColumnToggleText={showColumnToggleText}
        onAddClick={onAddClick}
        addButtonText={addButtonText}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
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
      <DataTablePagination table={table} />
    </div>
  );
}
