import { Plus, X } from 'lucide-react';

import { Button } from '~/shared/shadcn';

import { useDataTableContext } from '../../lib/context';

import { ColumnToggle } from './ColumnToggle';
import { SearchInput } from './SearchInput';

export const TableToolbar = () => {
  const { ui, callbacks, search, table, state } = useDataTableContext();
  const isFiltered = table.getState().columnFilters.length > 0 || !!search.state.globalFilter;

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex flex-1 items-center gap-2">
        <SearchInput />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              search.setGlobalFilter('');
              state.resetFilters();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Zurücksetzen
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {callbacks.onAdd && (
          <Button variant="outline" size="sm" className="h-8" onClick={callbacks.onAdd}>
            <Plus className={ui.addButtonText ? 'mr-2 h-4 w-4' : 'h-4 w-4'} />
            {ui.addButtonText}
          </Button>
        )}

        {ui.showColumnToggle && <ColumnToggle />}
      </div>
    </div>
  );
};
