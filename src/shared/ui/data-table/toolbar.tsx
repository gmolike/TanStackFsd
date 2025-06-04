// src/shared/ui/data-table/toolbar.tsx
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button, InputShadcn as Input } from '~/shared/shadcn';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
}

/**
 * DataTableToolbar Component
 * Toolbar für die DataTable mit Suchfunktion und Filter-Reset
 */
export function DataTableToolbar<TData>({ table, searchKey }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchKey && (
          <Input
            placeholder="Suchen..."
            value={table.getColumn(searchKey)?.getFilterValue() as string}
            onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Zurücksetzen
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
