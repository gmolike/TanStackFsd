// ===== TablePagination.tsx =====
// src/shared/ui/data-table/components/TablePagination.tsx
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/shared/shadcn';

import type { PaginationProps } from '../types';

/**
 * Pagination-Kontrollen für DataTable
 *
 * @component
 * @param props - Pagination Konfiguration
 */
export const TablePagination = <TData,>({ table }: PaginationProps<TData>) => (
  <div className="flex items-center justify-between px-2">
    {/* Links: Seite x von y und Zeilen pro Seite */}
    <div className="flex items-center space-x-4">
      <div className="text-sm text-muted-foreground">
        Seite {table.getState().pagination.pageIndex + 1} von {table.getPageCount()}
      </div>
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Zeilen pro Seite</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Rechts: Navigation Buttons */}
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Zur ersten Seite</span>
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Vorherige Seite</span>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Nächste Seite</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Zur letzten Seite</span>
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
