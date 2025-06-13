// src/entities/team/api/useApi.ts

import { useQueryClient } from '@tanstack/react-query';
import { useRemoteMutation, useRemoteQuery } from '~/shared/api/query';
import type { RemoteMutationOptions, RemoteQueryOptions } from '~/shared/api/query/type';
import type { CreateTeamMember, TeamMember, UpdateTeamMember } from '../model/schema';
import { QueryParams, PaginatedResult } from '~/shared/mock/types';

/**
 * Zentrale API Hooks für Team Entity
 * Nutzt jetzt echte HTTP-Requests über MSW
 */

// ===== QUERY HOOKS =====

/**
 * Hook zum Abrufen aller Teammitglieder
 */
export const useTeamMembers = (
  params?: QueryParams,
  options?: RemoteQueryOptions<PaginatedResult<TeamMember>>,
) =>
  useRemoteQuery<PaginatedResult<TeamMember>>(
    ['team-members', params],
    '/api/team-members',
    { params: params as any },
    {
      staleTime: 5 * 60 * 1000, // 5 Minuten
      ...options,
    },
  );

/**
 * Hook zum Abrufen eines einzelnen Teammitglieds
 */
export const useTeamMember = (
  id: string,
  options?: RemoteQueryOptions<TeamMember> & { enabled?: boolean },
) =>
  useRemoteQuery<TeamMember>(['team-members', id], `/api/team-members/${id}`, undefined, {
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

/**
 * Hook zum Abrufen von Team-Statistiken
 */
export const useTeamStats = (
  options?: RemoteQueryOptions<{
    totalCount: number;
    byDepartment: Record<string, number>;
    byStatus: Record<string, number>;
    remoteCount: number;
  }>,
) =>
  useRemoteQuery(['team-members', 'stats'], '/api/team-members/stats', undefined, {
    staleTime: 10 * 60 * 1000, // 10 Minuten
    ...options,
  });

/**
 * Hook zum Abrufen von Remote-Teammitgliedern
 */
export const useRemoteTeamMembers = (
  params?: QueryParams,
  options?: RemoteQueryOptions<PaginatedResult<TeamMember>>,
) =>
  useRemoteQuery<PaginatedResult<TeamMember>>(
    ['team-members', 'remote', params],
    '/api/team-members/remote',
    { params: params as any },
    {
      staleTime: 5 * 60 * 1000,
      ...options,
    },
  );

/**
 * Hook zum Abrufen von Teammitgliedern nach Abteilung
 */
export const useTeamMembersByDepartment = (
  department: string,
  params?: Omit<QueryParams, 'filters'>,
  options?: RemoteQueryOptions<PaginatedResult<TeamMember>>,
) =>
  useRemoteQuery<PaginatedResult<TeamMember>>(
    ['team-members', 'department', department, params],
    `/api/team-members/department/${department}`,
    { params: params as any },
    {
      enabled: !!department,
      staleTime: 5 * 60 * 1000,
      ...options,
    },
  );

/**
 * Hook zum Abrufen von Teammitgliedern nach Status
 */
export const useTeamMembersByStatus = (
  status: string,
  params?: Omit<QueryParams, 'filters'>,
  options?: RemoteQueryOptions<PaginatedResult<TeamMember>>,
) =>
  useRemoteQuery<PaginatedResult<TeamMember>>(
    ['team-members', 'status', status, params],
    `/api/team-members/status/${status}`,
    { params: params as any },
    {
      enabled: !!status,
      staleTime: 5 * 60 * 1000,
      ...options,
    },
  );

/**
 * Hook zum Abrufen der Organisationsstruktur
 */
export const useOrganizationChart = (
  options?: RemoteQueryOptions<{
    departments: Array<{
      name: string;
      manager: TeamMember | null;
      members: Array<TeamMember>;
    }>;
  }>,
) =>
  useRemoteQuery(['team-members', 'org-chart'], '/api/team-members/org-chart', undefined, {
    staleTime: 30 * 60 * 1000, // 30 Minuten
    ...options,
  });

// ===== MUTATION HOOKS =====

/**
 * Hook zum Erstellen eines neuen Teammitglieds
 */
export const useCreateTeamMember = (
  options?: RemoteMutationOptions<TeamMember, CreateTeamMember>,
) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<TeamMember, CreateTeamMember>(
    ['team-members', 'create'],
    '/api/team-members',
    'POST',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere relevante Queries
        await queryClient.invalidateQueries({ queryKey: ['team-members'] });
        await queryClient.invalidateQueries({ queryKey: ['team-members', 'stats'] });
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

/**
 * Hook zum Aktualisieren eines Teammitglieds
 */
export const useUpdateTeamMember = (
  options?: RemoteMutationOptions<TeamMember, UpdateTeamMember>,
) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<TeamMember, UpdateTeamMember>(
    ['team-members', 'update'],
    (data) => `/api/team-members/${data.id}`,
    'PUT',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere spezifisches Mitglied und Listen
        await queryClient.invalidateQueries({ queryKey: ['team-members', data.id] });
        await queryClient.invalidateQueries({ queryKey: ['team-members'] });
        await queryClient.invalidateQueries({ queryKey: ['team-members', 'stats'] });
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

/**
 * Hook zum Löschen eines Teammitglieds
 */
export const useDeleteTeamMember = (options?: RemoteMutationOptions<void, string>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<void, string>(
    ['team-members', 'delete'],
    (id) => `/api/team-members/${id}`,
    'DELETE',
    undefined,
    {
      ...options,
      onSuccess: async (data, id, context) => {
        // Entferne aus Cache und invalidiere Listen
        queryClient.removeQueries({ queryKey: ['team-members', id] });
        await queryClient.invalidateQueries({ queryKey: ['team-members'] });
        await queryClient.invalidateQueries({ queryKey: ['team-members', 'stats'] });
        options?.onSuccess?.(data, id, context);
      },
    },
  );
};

/**
 * Hook zum Aktualisieren des Status eines Teammitglieds
 */
export const useUpdateTeamMemberStatus = (
  options?: RemoteMutationOptions<
    TeamMember,
    { id: string; status: 'active' | 'inactive' | 'vacation' }
  >,
) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<TeamMember, { id: string; status: 'active' | 'inactive' | 'vacation' }>(
    ['team-members', 'update-status'],
    ({ id }) => `/api/team-members/${id}/status`,
    'PATCH',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere relevante Queries
        await queryClient.invalidateQueries({ queryKey: ['team-members', data.id] });
        await queryClient.invalidateQueries({ queryKey: ['team-members'] });
        await queryClient.invalidateQueries({
          queryKey: ['team-members', 'status', variables.status],
        });
        await queryClient.invalidateQueries({ queryKey: ['team-members', 'stats'] });
        options?.onSuccess?.(data, variables, context);
      },
      // Optimistisches Update
      onMutate: async ({ id, status }) => {
        await queryClient.cancelQueries({ queryKey: ['team-members', id] });

        const previousMember = queryClient.getQueryData<TeamMember>(['team-members', id]);

        if (previousMember) {
          queryClient.setQueryData<TeamMember>(['team-members', id], {
            ...previousMember,
            status,
          });
        }

        return { previousMember };
      },
      onError: (err, variables, context) => {
        if (context?.previousMember) {
          queryClient.setQueryData(['team-members', variables.id], context.previousMember);
        }
        options?.onError?.(err, variables, context);
      },
    },
  );
};

/**
 * Hook zum Zurücksetzen der Mock-Daten
 */
export const useResetTeamMembers = (options?: RemoteMutationOptions<void, { count?: number }>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<void, { count?: number }>(
    ['team-members', 'reset'],
    '/api/team-members/reset',
    'POST',
    undefined,
    {
      ...options,
      onSuccess: async (data, variables, context) => {
        // Invalidiere alle Team-bezogenen Queries
        await queryClient.invalidateQueries({ queryKey: ['team-members'] });
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};
