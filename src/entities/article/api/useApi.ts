// src/entities/article/api/useApi.ts

import { useQueryClient } from '@tanstack/react-query';
import { useRemoteMutation, useRemoteQuery } from '~/shared/api/query';
import type { RemoteMutationOptions, RemoteQueryOptions } from '~/shared/api/query/type';
import type { PaginatedResult, QueryParams } from '~/shared/mock';
import type { Article, CreateArticle, UpdateArticle } from '../model/schema';

/**
 * Zentrale API Hooks für Article Entity
 * Nutzt jetzt echte HTTP-Requests über MSW
 */

// ===== QUERY HOOKS =====

/**
 * Hook zum Abrufen aller Artikel mit Paginierung und Filterung
 */
export const useArticles = (
  params?: QueryParams,
  options?: RemoteQueryOptions<PaginatedResult<Article>>,
) =>
  useRemoteQuery<PaginatedResult<Article>>(
    ['articles', params],
    '/api/articles',
    {
      params: params as any, // Konvertiert zu URLSearchParams
    },
    options,
  );

/**
 * Hook zum Abrufen eines einzelnen Artikels
 */
export const useArticle = (id: string, options?: RemoteQueryOptions<Article>) =>
  useRemoteQuery<Article>(['articles', id], `/api/articles/${id}`, undefined, {
    enabled: !!id,
    ...options,
  });

/**
 * Hook zum Abrufen von Artikeln nach Kategorie
 */
export const useArticlesByCategory = (
  category: string,
  params?: Omit<QueryParams, 'filters'>,
  options?: RemoteQueryOptions<PaginatedResult<Article>>,
) =>
  useRemoteQuery<PaginatedResult<Article>>(
    ['articles', 'category', category, params],
    `/api/articles/category/${category}`,
    { params: params as any },
    {
      enabled: !!category,
      ...options,
    },
  );

/**
 * Hook zum Abrufen von Artikeln nach Status
 */
export const useArticlesByStatus = (
  status: string,
  params?: Omit<QueryParams, 'filters'>,
  options?: RemoteQueryOptions<PaginatedResult<Article>>,
) =>
  useRemoteQuery<PaginatedResult<Article>>(
    ['articles', 'status', status, params],
    `/api/articles/status/${status}`,
    { params: params as any },
    {
      enabled: !!status,
      ...options,
    },
  );

/**
 * Hook zum Abrufen von Artikeln mit niedrigem Lagerbestand
 */
export const useLowStockArticles = (
  params?: QueryParams,
  options?: RemoteQueryOptions<PaginatedResult<Article>>,
) =>
  useRemoteQuery<PaginatedResult<Article>>(
    ['articles', 'low-stock', params],
    '/api/articles/low-stock',
    { params: params as any },
    options,
  );

/**
 * Hook zum Abrufen von Artikel-Statistiken
 */
export const useArticleStats = (
  options?: RemoteQueryOptions<{
    totalCount: number;
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
    lowStockCount: number;
    digitalCount: number;
    averagePrice: number;
  }>,
) => useRemoteQuery(['articles', 'stats'], '/api/articles/stats', undefined, options);

// ===== MUTATION HOOKS =====

/**
 * Hook zum Erstellen eines neuen Artikels
 */
export const useCreateArticle = (options?: RemoteMutationOptions<Article, CreateArticle>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<Article, CreateArticle>(
    ['articles', 'create'],
    '/api/articles',
    'POST',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere relevante Queries
        await queryClient.invalidateQueries({ queryKey: ['articles'] });
        await queryClient.invalidateQueries({ queryKey: ['articles', 'stats'] });

        // Rufe ursprünglichen onSuccess auf
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

/**
 * Hook zum Aktualisieren eines Artikels
 */
export const useUpdateArticle = (options?: RemoteMutationOptions<Article, UpdateArticle>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<Article, UpdateArticle>(
    ['articles', 'update'],
    (data) => `/api/articles/${data.id}`,
    'PUT',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere spezifischen Artikel und Listen
        await queryClient.invalidateQueries({ queryKey: ['articles', data.id] });
        await queryClient.invalidateQueries({ queryKey: ['articles'] });
        await queryClient.invalidateQueries({ queryKey: ['articles', 'stats'] });

        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

/**
 * Hook zum Löschen eines Artikels
 */
export const useDeleteArticle = (options?: RemoteMutationOptions<void, string>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<void, string>(
    ['articles', 'delete'],
    (id) => `/api/articles/${id}`,
    'DELETE',
    undefined,
    {
      ...options,
      onSuccess: async (data, id, context) => {
        // Entferne aus Cache und invalidiere Listen
        queryClient.removeQueries({ queryKey: ['articles', id] });
        await queryClient.invalidateQueries({ queryKey: ['articles'] });
        await queryClient.invalidateQueries({ queryKey: ['articles', 'stats'] });

        options?.onSuccess?.(data, id, context);
      },
    },
  );
};

/**
 * Hook zum Aktualisieren des Lagerbestands
 */
export const useUpdateStock = (
  options?: RemoteMutationOptions<Article, { id: string; quantity: number }>,
) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<Article, { id: string; quantity: number }>(
    ['articles', 'update-stock'],
    ({ id }) => `/api/articles/${id}/stock`,
    'PATCH',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere relevante Queries
        await queryClient.invalidateQueries({ queryKey: ['articles', data.id] });
        await queryClient.invalidateQueries({ queryKey: ['articles'] });
        await queryClient.invalidateQueries({ queryKey: ['articles', 'low-stock'] });
        await queryClient.invalidateQueries({ queryKey: ['articles', 'stats'] });

        options?.onSuccess?.(data, variables, context);
      },
      onMutate: async ({ id, quantity }) => {
        // Optimistisches Update
        await queryClient.cancelQueries({ queryKey: ['articles', id] });

        const previousArticle = queryClient.getQueryData<Article>(['articles', id]);

        if (previousArticle) {
          queryClient.setQueryData<Article>(['articles', id], {
            ...previousArticle,
            stock: previousArticle.stock + quantity,
          });
        }

        return { previousArticle };
      },
      onError: (err, variables, context) => {
        // Rollback bei Fehler
        if (context?.previousArticle) {
          queryClient.setQueryData(['articles', variables.id], context.previousArticle);
        }
        options?.onError?.(err, variables, context);
      },
    },
  );
};

/**
 * Hook für Batch-Erstellung von Artikeln
 */
export const useCreateArticleBatch = (
  options?: RemoteMutationOptions<Array<Article>, Array<CreateArticle>>,
) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<Array<Article>, Array<CreateArticle>>(
    ['articles', 'create-batch'],
    '/api/articles/batch',
    'POST',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        await queryClient.invalidateQueries({ queryKey: ['articles'] });
        await queryClient.invalidateQueries({ queryKey: ['articles', 'stats'] });

        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

/**
 * Hook zum Zurücksetzen der Mock-Daten
 */
export const useResetArticles = (options?: RemoteMutationOptions<void, void>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<void, void>(
    ['articles', 'reset'],
    '/api/articles/reset',
    'POST',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere alle Article-bezogenen Queries
        await queryClient.invalidateQueries({ queryKey: ['articles'] });

        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};
