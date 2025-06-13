// ui/headers/index.ts
export { FilterableHeader } from './FilterableHeader';
export { SimpleHeader } from './SimpleHeader';
export { SortableHeader } from './SortableHeader';

export type HeaderProps = {
  label: string;
};

export type SortableHeaderProps<TData> = HeaderProps & {
  column: import('@tanstack/react-table').Column<TData, unknown>;
};

export type FilterableHeaderProps<TData> = SortableHeaderProps<TData>;

export const headerTypes = {
  simple: 'SimpleHeader',
  sortable: 'SortableHeader',
  filterable: 'FilterableHeader',
};

export type HeaderType = keyof typeof headerTypes;
