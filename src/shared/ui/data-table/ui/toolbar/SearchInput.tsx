import { useCallback, useEffect, useState } from 'react';

import { InputShadcn as Input } from '~/shared/shadcn';

import { useDataTableContext } from '../../lib/context';

export const SearchInput = () => {
  const { search, ui, handleGlobalFilterChange } = useDataTableContext();
  const [value, setValue] = useState(search.state.globalFilter);

  // Sync internal state with external state
  useEffect(() => {
    setValue(search.state.globalFilter);
  }, [search.state.globalFilter]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
      handleGlobalFilterChange(newValue);
    },
    [handleGlobalFilterChange],
  );

  return (
    <Input
      placeholder={ui.searchPlaceholder}
      value={value}
      onChange={handleChange}
      className="h-8 w-[200px] lg:w-[300px]"
    />
  );
};
