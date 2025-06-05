// src/entities/article/api/useApi.ts

import { useQueryClient } from '@tanstack/react-query';

import { useRemoteMutation, useRemoteQuery } from '~/shared/api/query';
import type { RemoteMutationOptions, RemoteQueryOptions } from '~/shared/api/query/type';
import type { PaginatedResult, QueryParams } from '~/shared/mock';

import type { Article, CreateArticle, UpdateArticle } from '../model/schema';

import { articleMockApi } from './mock-api';

/**
 * Zentrale API Hooks für Article Entity
 * Alle Article-bezogenen API Aufrufe sind hier gebündelt
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
    '/mock/articles', // Mock endpoint
    {
      params, // Wird in echter API als query params verwendet
    },
    {
      ...options,
      queryFn: async () => articleMockApi.getArticles(params), // Mock implementation
    },
  );

/**
 * Hook zum Abrufen eines einzelnen Artikels
 */
export const useArticle = (id: string, options?: RemoteQueryOptions<Article>) =>
  useRemoteQuery<Article>(['articles', id], `/mock/articles/${id}`, undefined, {
    enabled: !!id,
    ...options,
    queryFn: async () => articleMockApi.getArticleById(id),
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
    `/mock/articles/category/${category}`,
    { params },
    {
      enabled: !!category,
      ...options,
      queryFn: async () => articleMockApi.getArticlesByCategory(category, params),
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
    `/mock/articles/status/${status}`,
    { params },
    {
      enabled: !!status,
      ...options,
      queryFn: async () => articleMockApi.getArticlesByStatus(status, params),
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
    '/mock/articles/low-stock',
    { params },
    {
      ...options,
      queryFn: async () => articleMockApi.getLowStockArticles(params),
    },
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
) =>
  useRemoteQuery(['articles', 'stats'], '/mock/articles/stats', undefined, {
    ...options,
    queryFn: async () => articleMockApi.getArticleStats(),
  });

// ===== MUTATION HOOKS =====

/**
 * Hook zum Erstellen eines neuen Artikels
 */
export const useCreateArticle = (options?: RemoteMutationOptions<Article, CreateArticle>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<Article, CreateArticle>(
    ['articles', 'create'],
    '/mock/articles',
    'POST',
    undefined,
    {
      ...options,
      mutationFn: async (data) => articleMockApi.createArticle(data),
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
    '/mock/articles',
    'PUT',
    undefined,
    {
      ...options,
      mutationFn: async (data) => {
        if (!data.id) throw new Error('Article ID is required for update');
        return articleMockApi.updateArticle(data.id, data);
      },
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
    '/mock/articles',
    'DELETE',
    undefined,
    {
      ...options,
      mutationFn: async (id) => articleMockApi.deleteArticle(id),
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
    '/mock/articles/stock',
    'PATCH',
    undefined,
    {
      ...options,
      mutationFn: async ({ id, quantity }) => articleMockApi.updateStock(id, quantity),
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
    '/mock/articles/batch',
    'POST',
    undefined,
    {
      ...options,
      mutationFn: async (articles) => articleMockApi.createArticleBatch(articles),
      onSuccess: async (data, variables, context) => {
        await queryClient.invalidateQueries({ queryKey: ['articles'] });
        await queryClient.invalidateQueries({ queryKey: ['articles', 'stats'] });

        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

// ===== UTILITY HOOKS =====

/**
 * Hook zum Zurücksetzen der Mock-Daten
 */
export const useResetArticles = (options?: RemoteMutationOptions<void, void>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<void, void>(
    ['articles', 'reset'],
    '/mock/articles/reset',
    'POST',
    undefined,
    {
      ...options,
      mutationFn: async () => articleMockApi.resetData(),
      onSuccess: async (data, variables, context) => {
        // Invalidiere alle Article-bezogenen Queries
        await queryClient.invalidateQueries({ queryKey: ['articles'] });

        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};
