// src/entities/location/api/useApi.ts

import { useQueryClient } from '@tanstack/react-query';
import type { Article } from '~/entities/article';
import type { TeamMember } from '~/entities/team';
import { useRemoteMutation, useRemoteQuery } from '~/shared/api/query';
import type { RemoteMutationOptions, RemoteQueryOptions } from '~/shared/api/query/type';
import type {
  CreateLocation,
  CreateLocationInventory,
  Location,
  LocationInventory,
  UpdateLocation,
  UpdateLocationInventory,
} from '../model/schema';
import { QueryParams, PaginatedResult } from '~/shared/mock/types';

/**
 * Zentrale API Hooks für Location Entity
 * Nutzt jetzt echte HTTP-Requests über MSW
 */

// ===== QUERY HOOKS =====

/**
 * Hook zum Abrufen aller Standorte mit Paginierung und Filterung
 */
export const useLocations = (
  params?: QueryParams,
  options?: RemoteQueryOptions<PaginatedResult<Location>>,
) =>
  useRemoteQuery<PaginatedResult<Location>>(
    ['locations', params],
    '/api/locations',
    {
      params: params as any,
    },
    options,
  );

/**
 * Hook zum Abrufen eines einzelnen Standorts
 */
export const useLocation = (id: string, options?: RemoteQueryOptions<Location>) =>
  useRemoteQuery<Location>(['locations', id], `/api/locations/${id}`, undefined, {
    enabled: !!id,
    ...options,
  });

/**
 * Hook zum Abrufen von Standorten nach Typ
 */
export const useLocationsByType = (
  type: Location['type'],
  params?: Omit<QueryParams, 'filters'>,
  options?: RemoteQueryOptions<PaginatedResult<Location>>,
) =>
  useRemoteQuery<PaginatedResult<Location>>(
    ['locations', 'type', type, params],
    `/api/locations/type/${type}`,
    { params: params as any },
    {
      enabled: !!type,
      ...options,
    },
  );

/**
 * Hook zum Abrufen von Standorten nach Status
 */
export const useLocationsByStatus = (
  status: Location['status'],
  params?: Omit<QueryParams, 'filters'>,
  options?: RemoteQueryOptions<PaginatedResult<Location>>,
) =>
  useRemoteQuery<PaginatedResult<Location>>(
    ['locations', 'status', status, params],
    `/api/locations/status/${status}`,
    { params: params as any },
    {
      enabled: !!status,
      ...options,
    },
  );

// ===== INVENTAR HOOKS =====

/**
 * Hook zum Abrufen des Inventars eines Standorts
 */
export const useLocationInventory = (
  locationId: string,
  params?: QueryParams,
  options?: RemoteQueryOptions<PaginatedResult<LocationInventory & { article?: Article }>>,
) =>
  useRemoteQuery<PaginatedResult<LocationInventory & { article?: Article }>>(
    ['locations', locationId, 'inventory', params],
    `/api/locations/${locationId}/inventory`,
    { params: params as any },
    {
      enabled: !!locationId,
      ...options,
    },
  );

// ===== TEAM HOOKS =====

/**
 * Hook zum Abrufen der Teammitglieder eines Standorts
 */
export const useLocationTeamMembers = (
  locationId: string,
  params?: QueryParams,
  options?: RemoteQueryOptions<PaginatedResult<TeamMember>>,
) =>
  useRemoteQuery<PaginatedResult<TeamMember>>(
    ['locations', locationId, 'team', params],
    `/api/locations/${locationId}/team`,
    { params: params as any },
    {
      enabled: !!locationId,
      ...options,
    },
  );

/**
 * Hook zum Abrufen des Managers eines Standorts
 */
export const useLocationManager = (
  locationId: string,
  options?: RemoteQueryOptions<TeamMember | null>,
) =>
  useRemoteQuery<TeamMember | null>(
    ['locations', locationId, 'manager'],
    `/api/locations/${locationId}/manager`,
    undefined,
    {
      enabled: !!locationId,
      ...options,
    },
  );

// ===== STATISTIK HOOKS =====

/**
 * Hook zum Abrufen von Standort-Statistiken
 */
export const useLocationStats = (
  locationId: string,
  options?: RemoteQueryOptions<{
    totalArticles: number;
    totalStock: number;
    totalValue: number;
    lowStockCount: number;
    teamMemberCount: number;
    utilizationRate: number;
  }>,
) =>
  useRemoteQuery(
    ['locations', locationId, 'stats'],
    `/api/locations/${locationId}/stats`,
    undefined,
    {
      enabled: !!locationId,
      ...options,
    },
  );

/**
 * Hook zum Abrufen globaler Standort-Statistiken
 */
export const useGlobalLocationStats = (
  options?: RemoteQueryOptions<{
    totalCount: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    totalCapacity: number;
    totalTeamMembers: number;
  }>,
) => useRemoteQuery(['locations', 'global-stats'], '/api/locations/stats', undefined, options);

// ===== MUTATION HOOKS =====

/**
 * Hook zum Erstellen eines neuen Standorts
 */
export const useCreateLocation = (options?: RemoteMutationOptions<Location, CreateLocation>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<Location, CreateLocation>(
    ['locations', 'create'],
    '/api/locations',
    'POST',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere relevante Queries
        await queryClient.invalidateQueries({ queryKey: ['locations'] });
        await queryClient.invalidateQueries({ queryKey: ['locations', 'global-stats'] });

        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

/**
 * Hook zum Aktualisieren eines Standorts
 */
export const useUpdateLocation = (options?: RemoteMutationOptions<Location, UpdateLocation>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<Location, UpdateLocation>(
    ['locations', 'update'],
    (data) => `/api/locations/${data.id}`,
    'PUT',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere spezifischen Standort und Listen
        await queryClient.invalidateQueries({ queryKey: ['locations', data.id] });
        await queryClient.invalidateQueries({ queryKey: ['locations'] });
        await queryClient.invalidateQueries({ queryKey: ['locations', 'global-stats'] });

        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

/**
 * Hook zum Löschen eines Standorts
 */
export const useDeleteLocation = (options?: RemoteMutationOptions<void, string>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<void, string>(
    ['locations', 'delete'],
    (id) => `/api/locations/${id}`,
    'DELETE',
    undefined,
    {
      ...options,
      onSuccess: async (data, id, context) => {
        // Entferne aus Cache und invalidiere Listen
        queryClient.removeQueries({ queryKey: ['locations', id] });
        await queryClient.invalidateQueries({ queryKey: ['locations'] });
        await queryClient.invalidateQueries({ queryKey: ['locations', 'global-stats'] });

        options?.onSuccess?.(data, id, context);
      },
    },
  );
};

// ===== INVENTAR MUTATION HOOKS =====

/**
 * Hook zum Hinzufügen eines Artikels zum Standort-Inventar
 */
export const useAddArticleToLocation = (
  options?: RemoteMutationOptions<LocationInventory, CreateLocationInventory>,
) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<LocationInventory, CreateLocationInventory>(
    ['locations', 'inventory', 'add'],
    '/api/locations/inventory',
    'POST',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere Inventar des Standorts
        await queryClient.invalidateQueries({
          queryKey: ['locations', variables.locationId, 'inventory'],
        });
        await queryClient.invalidateQueries({
          queryKey: ['locations', variables.locationId, 'stats'],
        });

        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

/**
 * Hook zum Aktualisieren von Inventar-Informationen
 */
export const useUpdateLocationInventory = (
  options?: RemoteMutationOptions<LocationInventory, UpdateLocationInventory>,
) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<LocationInventory, UpdateLocationInventory>(
    ['locations', 'inventory', 'update'],
    (data) => `/api/locations/inventory/${data.id}`,
    'PUT',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere Inventar des Standorts
        await queryClient.invalidateQueries({
          queryKey: ['locations', data.locationId, 'inventory'],
        });
        await queryClient.invalidateQueries({
          queryKey: ['locations', data.locationId, 'stats'],
        });

        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

/**
 * Hook zum Entfernen eines Artikels aus dem Standort-Inventar
 */
export const useRemoveArticleFromLocation = (options?: RemoteMutationOptions<void, string>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<void, string>(
    ['locations', 'inventory', 'remove'],
    (inventoryId) => `/api/locations/inventory/${inventoryId}`,
    'DELETE',
    undefined,
    {
      ...options,
      onSuccess: async (data, inventoryId, context) => {
        // Invalidiere alle Inventar-bezogenen Queries
        await queryClient.invalidateQueries({
          queryKey: ['locations'],
          predicate: (query) => {
            const key = query.queryKey;
            return Array.isArray(key) && key.includes('inventory');
          },
        });

        options?.onSuccess?.(data, inventoryId, context);
      },
    },
  );
};

/**
 * Hook zum Zurücksetzen der Mock-Daten
 */
export const useResetLocations = (options?: RemoteMutationOptions<void, void>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<void, void>(
    ['locations', 'reset'],
    '/api/locations/reset',
    'POST',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere alle Location-bezogenen Queries
        await queryClient.invalidateQueries({ queryKey: ['locations'] });

        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};
