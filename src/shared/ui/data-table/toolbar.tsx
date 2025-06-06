// src/shared/ui/data-table/toolbar.tsx
import type { Table, VisibilityState } from '@tanstack/react-table';
import { Settings2, X } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  InputShadcn as Input,
} from '~/shared/shadcn';

interface ColumnLabel {
  id: string;
  label: string;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  columnLabels?: Record<string, string>;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  showColumnToggle?: boolean;
}

/**
 * DataTableToolbar Component
 * Erweiterte Toolbar mit Suchfunktion, Filter-Reset und Spaltenauswahl
 *
 * @param table - Die TanStack Table Instanz
 * @param searchKey - Der Schlüssel für die Suchspalte
 * @param searchPlaceholder - Placeholder-Text für das Suchfeld
 * @param columnLabels - Mapping von Spalten-IDs zu Display-Labels
 * @param showColumnToggle - Ob die Spaltenauswahl angezeigt werden soll
 */
export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = 'Suchen...',
  columnLabels = {},
  columnVisibility,
  onColumnVisibilityChange,
  showColumnToggle = true,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Funktion zum Abrufen des Column Labels
  const getColumnLabel = (columnId: string): string => columnLabels[columnId] || columnId;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
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

      {/* Spaltenauswahl - nur anzeigen wenn aktiviert */}
      {showColumnToggle && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-8">
              <Settings2 className="mr-2 h-4 w-4" />
              Spalten
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Sichtbare Spalten</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  // Verstecke actions und Spalten die nicht versteckbar sind
                  column.getCanHide() && column.id !== 'actions',
              )
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {getColumnLabel(column.id)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
