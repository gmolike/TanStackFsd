import { Filter } from 'lucide-react';

import {
  Button,
  InputShadcn as Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/shared/shadcn';

import type { FilterableHeaderProps } from './index';

export const FilterableHeader = <TData,>({ label, column }: FilterableHeaderProps<TData>) => {
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
