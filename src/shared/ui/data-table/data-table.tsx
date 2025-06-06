// src/shared/ui/data-table/data-table.tsx
import { useState } from 'react';

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
}

/**
 * DataTable Component
 * Erweiterte generische Tabellen-Komponente mit Sortierung, Filterung, Pagination
 *
 * @param columns - Spaltendefinitionen für die Tabelle
 * @param data - Daten für die Tabelle
 * @param searchKey - Schlüssel für die Suchfunktion
 * @param searchPlaceholder - Placeholder für das Suchfeld
 * @param onRowClick - Callback beim Klick auf eine Zeile
 * @param defaultSorting - Standard-Sortierung beim ersten Laden
 * @param defaultColumnVisibility - Standard-Sichtbarkeit der Spalten
 * @param pageSize - Anzahl der Einträge pro Seite
 * @param columnLabels - Labels für die Spalten im Dropdown
 * @param showColumnToggle - Ob die Spaltenauswahl angezeigt werden soll
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
  onRowClick,
  defaultSorting = [],
  defaultColumnVisibility = {},
  pageSize = 10,
  columnLabels,
  showColumnToggle = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        searchPlaceholder={searchPlaceholder}
        columnLabels={columnLabels}
        showColumnToggle={showColumnToggle}
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
            {table.getRowModel().rows.length ? (
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
