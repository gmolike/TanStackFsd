// src/shared/ui/data-table/components/TableToolbar.tsx
import { Plus, Settings2, X } from 'lucide-react';

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

import type { ToolbarProps } from '../types';

/**
 * Toolbar für DataTable mit Suche und Aktionen
 *
 * @component
 * @param props - Toolbar Konfiguration
 */
export const TableToolbar = <TData,>({
  table,
  searchPlaceholder = 'Suche...',
  columnLabels = {},
  showColumnToggle = true,
  showColumnToggleText = false,
  onAddClick,
  addButtonText,
  globalFilter,
  onGlobalFilterChange,
}: ToolbarProps<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0 || !!globalFilter;

  /**
   * Holt das Label für eine Spalte
   */
  const getColumnLabel = (columnId: string): string => columnLabels[columnId] || columnId;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {onGlobalFilterChange && (
          <>
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={(event) => {
                onGlobalFilterChange(event.target.value);
              }}
              className="h-8 w-[200px] lg:w-[300px]"
            />
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => {
                  table.resetColumnFilters();
                  table.resetGlobalFilter();
                  onGlobalFilterChange('');
                }}
                className="h-8 px-2 lg:px-3"
              >
                Zurücksetzen
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {onAddClick && (
          <Button variant="outline" size="sm" className="h-8" onClick={onAddClick}>
            <Plus className={addButtonText ? 'mr-2 h-4 w-4' : 'h-4 w-4'} />
            {addButtonText}
          </Button>
        )}

        {showColumnToggle && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Settings2 className={showColumnToggleText ? 'mr-2 h-4 w-4' : 'h-4 w-4'} />
                {showColumnToggleText && 'Spalten'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[200px]"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuLabel>Sichtbare Spalten</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide() && column.id !== 'actions')
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {getColumnLabel(column.id)}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};
