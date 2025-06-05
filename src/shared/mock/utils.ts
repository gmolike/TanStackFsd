// src/shared/mock/utils.ts

/**
 * Utility-Funktionen für Mock-APIs
 */

/**
 * Simuliert eine Netzwerk-Verzögerung
 */
export const delay = (ms: number = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simuliert zufällige Netzwerk-Verzögerung
 */
export const randomDelay = (min: number = 100, max: number = 500): Promise<void> => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return delay(ms);
};

/**
 * Simuliert einen Fehler mit einer bestimmten Wahrscheinlichkeit
 */
export const maybeThrowError = (
  probability: number = 0.1,
  message: string = 'Simulated error',
): void => {
  if (Math.random() < probability) {
    throw new Error(message);
  }
};

/**
 * Paginiert ein Array
 */
export interface PaginationParams {
  page: number;
  limit: number;
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

export const paginate = <T>(
  array: Array<T>,
  { page = 1, limit = 10 }: Partial<PaginationParams> = {},
): PaginatedResult<T> => {
  const total = array.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = array.slice(startIndex, endIndex);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

/**
 * Sortiert ein Array nach einem Feld
 */
export type SortOrder = 'asc' | 'desc';

export interface SortParams {
  field: string;
  order: SortOrder;
}

export const sortBy = <T>(array: Array<T>, { field, order = 'asc' }: SortParams): Array<T> =>
  [...array].sort((a, b) => {
    const aValue = (a as any)[field];
    const bValue = (b as any)[field];

    if (aValue === bValue) return 0;

    const result = aValue < bValue ? -1 : 1;
    return order === 'asc' ? result : -result;
  });

/**
 * Filtert ein Array nach mehreren Kriterien
 */
export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

export interface FilterParam {
  field: string;
  operator: FilterOperator;
  value: any;
}

export const applyFilter = <T>(item: T, filter: FilterParam): boolean => {
  const itemValue = (item as any)[filter.field];
  const filterValue = filter.value;

  switch (filter.operator) {
    case 'eq':
      return itemValue === filterValue;
    case 'neq':
      return itemValue !== filterValue;
    case 'gt':
      return itemValue > filterValue;
    case 'gte':
      return itemValue >= filterValue;
    case 'lt':
      return itemValue < filterValue;
    case 'lte':
      return itemValue <= filterValue;
    case 'contains':
      return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase());
    case 'startsWith':
      return String(itemValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
    case 'endsWith':
      return String(itemValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
    default:
      return true;
  }
};

export const filterBy = <T>(array: Array<T>, filters: Array<FilterParam>): Array<T> =>
  array.filter((item) => filters.every((filter) => applyFilter(item, filter)));

/**
 * Kombinierte Such-, Filter-, Sortier- und Paginierungsfunktion
 */
export interface QueryParams extends Partial<PaginationParams> {
  search?: string;
  searchFields?: Array<string>;
  filters?: Array<FilterParam>;
  sort?: SortParams;
}

export const queryData = <T>(array: Array<T>, params: QueryParams = {}): PaginatedResult<T> => {
  let result = [...array];

  // Suche
  if (params.search && params.searchFields?.length) {
    const searchLower = params.search.toLowerCase();
    result = result.filter((item) =>
      params.searchFields!.some((field) => {
        const value = (item as any)[field];
        return String(value).toLowerCase().includes(searchLower);
      }),
    );
  }

  // Filter
  if (params.filters?.length) {
    result = filterBy(result, params.filters);
  }

  // Sortierung
  if (params.sort) {
    result = sortBy(result, params.sort);
  }

  // Paginierung
  return paginate(result, { page: params.page, limit: params.limit });
};

/**
 * Simuliert einen API Response mit Metadaten
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export const createApiResponse = <T>(
  data: T,
  success: boolean = true,
  message?: string,
): ApiResponse<T> => ({
  data,
  success,
  message,
  timestamp: new Date().toISOString(),
});

/**
 * Simuliert einen API Fehler
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const createApiError = (statusCode: number, message: string, details?: any): never => {
  throw new ApiError(statusCode, message, details);
};
