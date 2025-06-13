// src/shared/mock/types.ts

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: Array<SortParam>;
  filters?: Array<FilterParam>;
  fields?: Array<string>;
  searchFields?: Array<string>;
}

export interface SortParam {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterParam {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'nin';
  value: any;
}

export interface PaginatedResult<T> {
  data: Array<T>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
