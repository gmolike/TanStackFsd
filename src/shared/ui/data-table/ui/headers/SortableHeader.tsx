import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '~/shared/shadcn';

import type { SortableHeaderProps } from './index';

export const SortableHeader = <TData,>({ label, column }: SortableHeaderProps<TData>) => {
  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className="-ml-3 h-8 text-xs font-medium uppercase tracking-wider hover:bg-transparent"
    >
      {label}
      {isSorted === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
      {isSorted === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
      {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
    </Button>
  );
};
