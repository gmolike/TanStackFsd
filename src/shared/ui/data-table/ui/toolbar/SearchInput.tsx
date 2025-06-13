import { useCallback } from 'react';

import { InputShadcn as Input } from '~/shared/shadcn';

import { useDataTableContext } from '../DataTableProvider';

export const SearchInput = () => {
  const { search, ui, handleGlobalFilterChange } = useDataTableContext();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleGlobalFilterChange(event.target.value);
    },
    [handleGlobalFilterChange],
  );

  return (
    <Input
      placeholder={ui.searchPlaceholder}
      value={search.state.globalFilter ?? ''}
      onChange={handleChange}
      className="h-8 w-[200px] lg:w-[300px]"
    />
  );
};
