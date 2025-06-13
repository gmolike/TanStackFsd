// src/shared/mock/utils/pagination.ts

import type { PaginatedResult } from '../types';

/**
 * Erstellt eine paginierte Response
 */
export const createPaginatedResponse = <T>(
  data: Array<T>,
  page: number = 1,
  limit: number = 10,
  total?: number,
): PaginatedResult<T> => {
  const actualTotal = total || data.length;
  const totalPages = Math.ceil(actualTotal / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: actualTotal,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};
