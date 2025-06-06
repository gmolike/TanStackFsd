// src/entities/location/api/useApi.ts

import { useQueryClient } from '@tanstack/react-query';

import type { Article } from '~/entities/article';
import type { TeamMember } from '~/entities/team';

import { useRemoteMutation, useRemoteQuery } from '~/shared/api/query';
import type { RemoteMutationOptions, RemoteQueryOptions } from '~/shared/api/query/type';
import type { PaginatedResult, QueryParams } from '~/shared/mock';

import type {
  CreateLocation,
  CreateLocationInventory,
  Location,
  LocationInventory,
  UpdateLocation,
  UpdateLocationInventory,
} from '../model/schema';

import { locationMockApi } from './mock-api';

/**
 * Zentrale API Hooks für Location Entity
 * Alle Location-bezogenen API Aufrufe sind hier gebündelt
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
    '/mock/locations',
    {
      params,
    },
    {
      ...options,
      queryFn: async () => locationMockApi.getLocations(params),
    },
  );

/**
 * Hook zum Abrufen eines einzelnen Standorts
 */
export const useLocation = (id: string, options?: RemoteQueryOptions<Location>) =>
  useRemoteQuery<Location>(['locations', id], `/mock/locations/${id}`, undefined, {
    enabled: !!id,
    ...options,
    queryFn: async () => locationMockApi.getLocationById(id),
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
    `/mock/locations/type/${type}`,
    { params },
    {
      enabled: !!type,
      ...options,
      queryFn: async () => locationMockApi.getLocationsByType(type, params),
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
    `/mock/locations/status/${status}`,
    { params },
    {
      enabled: !!status,
      ...options,
      queryFn: async () => locationMockApi.getLocationsByStatus(status, params),
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
    `/mock/locations/${locationId}/inventory`,
    { params },
    {
      enabled: !!locationId,
      ...options,
      queryFn: async () => locationMockApi.getLocationInventory(locationId, params),
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
    `/mock/locations/${locationId}/team`,
    { params },
    {
      enabled: !!locationId,
      ...options,
      queryFn: async () => locationMockApi.getLocationTeamMembers(locationId, params),
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
    `/mock/locations/${locationId}/manager`,
    undefined,
    {
      enabled: !!locationId,
      ...options,
      queryFn: async () => locationMockApi.getLocationManager(locationId),
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
    `/mock/locations/${locationId}/stats`,
    undefined,
    {
      enabled: !!locationId,
      ...options,
      queryFn: async () => locationMockApi.getLocationStats(locationId),
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
) =>
  useRemoteQuery(['locations', 'global-stats'], '/mock/locations/stats', undefined, {
    ...options,
    queryFn: async () => locationMockApi.getGlobalLocationStats(),
  });

// ===== MUTATION HOOKS =====

/**
 * Hook zum Erstellen eines neuen Standorts
 */
export const useCreateLocation = (options?: RemoteMutationOptions<Location, CreateLocation>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<Location, CreateLocation>(
    ['locations', 'create'],
    '/mock/locations',
    'POST',
    undefined,
    {
      ...options,
      mutationFn: async (data) => locationMockApi.createLocation(data),
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
    '/mock/locations',
    'PUT',
    undefined,
    {
      ...options,
      mutationFn: async (data) => {
        if (!data.id) throw new Error('Location ID is required for update');
        return locationMockApi.updateLocation(data.id, data);
      },
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
    '/mock/locations',
    'DELETE',
    undefined,
    {
      ...options,
      mutationFn: async (id) => locationMockApi.deleteLocation(id),
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
    '/mock/locations/inventory',
    'POST',
    undefined,
    {
      ...options,
      mutationFn: async (data) => locationMockApi.addArticleToLocation(data),
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
    '/mock/locations/inventory',
    'PUT',
    undefined,
    {
      ...options,
      mutationFn: async (data) => {
        if (!data.id) throw new Error('Inventory ID is required for update');
        return locationMockApi.updateLocationInventory(data.id, data);
      },
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
      onMutate: async (data) => {
        // Optimistisches Update für Bestandsänderungen
        if ('stock' in data && data.id) {
          const queryKey = ['locations', 'inventory'];
          await queryClient.cancelQueries({ queryKey });

          const previousData = queryClient.getQueryData(queryKey);

          // Hier könnten wir das optimistische Update implementieren

          return { previousData };
        }
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
    '/mock/locations/inventory',
    'DELETE',
    undefined,
    {
      ...options,
      mutationFn: async (inventoryId) => locationMockApi.removeArticleFromLocation(inventoryId),
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

// ===== UTILITY HOOKS =====

/**
 * Hook zum Zurücksetzen der Mock-Daten
 */
export const useResetLocations = (options?: RemoteMutationOptions<void, void>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<void, void>(
    ['locations', 'reset'],
    '/mock/locations/reset',
    'POST',
    undefined,
    {
      ...options,
      mutationFn: async () => locationMockApi.resetData(),
      onSuccess: async (data, variables, context) => {
        // Invalidiere alle Location-bezogenen Queries
        await queryClient.invalidateQueries({ queryKey: ['locations'] });

        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};
