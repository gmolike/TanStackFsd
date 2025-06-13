export type FieldDefinition<TData = unknown> = {
  id: string;
  accessor?: string | ((row: TData) => unknown);
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  defaultVisible?: boolean;
  cell?: React.ComponentType<{ value: unknown; row: TData }> | 'default' | 'actions';
  width?: number | string;
};

export type TableDefinition<TData = unknown> = {
  labels: Record<string, string>;
  fields: Array<FieldDefinition<TData>>;
};

export type ExtractFieldIds<T extends TableDefinition<any>> =
  T extends TableDefinition<infer _> ? T['fields'][number]['id'] : never;
