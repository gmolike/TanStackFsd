// shared/ui/data-table/standard-headers/index.tsx
import type { Column } from '@tanstack/react-table';
import { ArrowUpDown, Filter } from 'lucide-react';

import {
  Button,
  InputShadcn as Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/shared/shadcn';

/**
 * Simple header without any functionality
 */
export const SimpleHeader = ({ label }: { label: string }) => (
  <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
);

/**
 * Sortable header with sort indicator
 */
export const SortableHeader = <TData,>({
  label,
  column,
}: {
  label: string;
  column: Column<TData, unknown>;
}) => (
  <Button
    variant="ghost"
    className="-ml-3 h-8 text-xs font-medium uppercase tracking-wider hover:bg-transparent"
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  >
    {label}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

/**
 * Filterable header with inline filter
 */
export const FilterableHeader = <TData,>({
  label,
  column,
}: {
  label: string;
  column: Column<TData, unknown>;
}) => {
  const filterValue = column.getFilterValue();

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Filter className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-2">
            <p className="text-sm font-medium">Filter {label}</p>
            <Input
              placeholder={`Filter ${label}...`}
              value={typeof filterValue === 'string' ? filterValue : ''}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="h-8"
            />
            {typeof filterValue === 'string' && filterValue && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => column.setFilterValue(undefined)}
                className="w-full"
              >
                Clear
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

/**
 * Export all header types as a map for easy access
 */
export const headerTemplates = {
  simple: SimpleHeader,
  sortable: SortableHeader,
  filterable: FilterableHeader,
} as const;

export type HeaderType = keyof typeof headerTemplates;
