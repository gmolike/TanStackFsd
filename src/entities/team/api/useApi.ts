// src/entities/team/api/useApi.ts

import { useQueryClient } from '@tanstack/react-query';

import { useRemoteMutation, useRemoteQuery } from '~/shared/api/query';
import type { RemoteMutationOptions, RemoteQueryOptions } from '~/shared/api/query/type';
import type { PaginatedResult, QueryParams } from '~/shared/mock';

import type { CreateTeamMember, TeamMember, UpdateTeamMember } from '../model/schema';

import { teamMockApi } from './mock-api';

/**
 * Zentrale API Hooks für Team Entity
 * Alle Team-bezogenen API Aufrufe sind hier gebündelt
 */

// ===== QUERY HOOKS =====

/**
 * Hook zum Abrufen aller Teammitglieder mit Paginierung und Filterung
 */
export const useTeamMembers = (
  params?: QueryParams,
  options?: RemoteQueryOptions<PaginatedResult<TeamMember>>,
) =>
  useRemoteQuery<PaginatedResult<TeamMember>>(
    ['team-members', params],
    '/mock/team-members',
    {
      params,
    },
    {
      ...options,
      queryFn: async () => teamMockApi.getTeamMembers(params),
    },
  );

/**
 * Hook zum Abrufen eines einzelnen Teammitglieds
 */
export const useTeamMember = (id: string, options?: RemoteQueryOptions<TeamMember>) =>
  useRemoteQuery<TeamMember>(['team-members', id], `/mock/team-members/${id}`, undefined, {
    enabled: !!id,
    ...options,
    queryFn: async () => teamMockApi.getTeamMemberById(id),
  });

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
    `/mock/team-members/department/${department}`,
    { params },
    {
      enabled: !!department,
      ...options,
      queryFn: async () => teamMockApi.getTeamMembersByDepartment(department, params),
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
    `/mock/team-members/status/${status}`,
    { params },
    {
      enabled: !!status,
      ...options,
      queryFn: async () => teamMockApi.getTeamMembersByStatus(status, params),
    },
  );

/**
 * Hook zum Abrufen von Remote-Teammitgliedern
 */
export const useRemoteTeamMembers = (
  params?: QueryParams,
  options?: RemoteQueryOptions<PaginatedResult<TeamMember>>,
) =>
  useRemoteQuery<PaginatedResult<TeamMember>>(
    ['team-members', 'remote', params],
    '/mock/team-members/remote',
    { params },
    {
      ...options,
      queryFn: async () => teamMockApi.getRemoteTeamMembers(params),
    },
  );

/**
 * Hook zum Abrufen von Team-Statistiken
 */
export const useTeamStats = (
  options?: RemoteQueryOptions<{
    totalCount: number;
    byDepartment: Record<string, number>;
    byStatus: Record<string, number>;
    remoteCount: number;
    averageTenure: number;
  }>,
) =>
  useRemoteQuery(['team-members', 'stats'], '/mock/team-members/stats', undefined, {
    ...options,
    queryFn: async () => teamMockApi.getTeamStats(),
  });

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
  useRemoteQuery(['team-members', 'org-chart'], '/mock/team-members/org-chart', undefined, {
    ...options,
    queryFn: async () => teamMockApi.getOrganizationChart(),
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
    '/mock/team-members',
    'POST',
    undefined,
    {
      ...options,
      mutationFn: async (data) => teamMockApi.createTeamMember(data),
      onSuccess: async (data, variables, context) => {
        // Invalidiere relevante Queries
        await queryClient.invalidateQueries({ queryKey: ['team-members'] });
        await queryClient.invalidateQueries({ queryKey: ['team-members', 'stats'] });
        await queryClient.invalidateQueries({ queryKey: ['team-members', 'org-chart'] });

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
    '/mock/team-members',
    'PUT',
    undefined,
    {
      ...options,
      mutationFn: async (data) => {
        if (!data.id) throw new Error('Team member ID is required for update');
        return teamMockApi.updateTeamMember(data.id, data);
      },
      onSuccess: async (data, variables, context) => {
        // Invalidiere spezifisches Mitglied und Listen
        await queryClient.invalidateQueries({ queryKey: ['team-members', data.id] });
        await queryClient.invalidateQueries({ queryKey: ['team-members'] });
        await queryClient.invalidateQueries({ queryKey: ['team-members', 'stats'] });
        await queryClient.invalidateQueries({ queryKey: ['team-members', 'org-chart'] });

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
    '/mock/team-members',
    'DELETE',
    undefined,
    {
      ...options,
      mutationFn: async (id) => teamMockApi.deleteTeamMember(id),
      onSuccess: async (data, id, context) => {
        // Entferne aus Cache und invalidiere Listen
        queryClient.removeQueries({ queryKey: ['team-members', id] });
        await queryClient.invalidateQueries({ queryKey: ['team-members'] });
        await queryClient.invalidateQueries({ queryKey: ['team-members', 'stats'] });
        await queryClient.invalidateQueries({ queryKey: ['team-members', 'org-chart'] });

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
    '/mock/team-members/status',
    'PATCH',
    undefined,
    {
      ...options,
      mutationFn: async ({ id, status }) => teamMockApi.updateTeamMemberStatus(id, status),
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
      onMutate: async ({ id, status }) => {
        // Optimistisches Update
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
        // Rollback bei Fehler
        if (context?.previousMember) {
          queryClient.setQueryData(['team-members', variables.id], context.previousMember);
        }
        options?.onError?.(err, variables, context);
      },
    },
  );
};

// ===== UTILITY HOOKS =====

/**
 * Hook zum Zurücksetzen der Mock-Daten
 */
export const useResetTeamMembers = (options?: RemoteMutationOptions<void, void>) => {
  const queryClient = useQueryClient();

  return useRemoteMutation<void, void>(
    ['team-members', 'reset'],
    '/mock/team-members/reset',
    'POST',
    undefined,
    {
      ...options,
      mutationFn: async () => teamMockApi.resetData(),
      onSuccess: async (data, variables, context) => {
        // Invalidiere alle Team-bezogenen Queries
        await queryClient.invalidateQueries({ queryKey: ['team-members'] });

        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};
