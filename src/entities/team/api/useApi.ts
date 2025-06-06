// src/entities/team/api/useApi.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { QueryParams } from '~/shared/mock';

import type { CreateTeamMember, TeamMember, UpdateTeamMember } from '../model/schema';

import { teamMockApi } from './mock-api';

/**
 * Vereinfachte API Hooks für Team Entity
 * Nutzt direkt die Mock-API ohne Remote-Calls
 */

// ===== QUERY HOOKS =====

/**
 * Hook zum Abrufen aller Teammitglieder
 */
export const useTeamMembers = (params?: QueryParams) =>
  useQuery({
    queryKey: ['team-members', params],
    queryFn: () => teamMockApi.getTeamMembers(params),
    staleTime: 5 * 60 * 1000, // 5 Minuten
  });

/**
 * Hook zum Abrufen eines einzelnen Teammitglieds
 */
export const useTeamMember = (id: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['team-members', id],
    queryFn: () => teamMockApi.getTeamMemberById(id),
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
    staleTime: 5 * 60 * 1000,
  });

/**
 * Hook zum Abrufen von Team-Statistiken
 */
export const useTeamStats = () =>
  useQuery({
    queryKey: ['team-members', 'stats'],
    queryFn: () => teamMockApi.getTeamStats(),
    staleTime: 10 * 60 * 1000, // 10 Minuten
  });

/**
 * Hook zum Abrufen von Remote-Teammitgliedern
 */
export const useRemoteTeamMembers = (params?: QueryParams) =>
  useQuery({
    queryKey: ['team-members', 'remote', params],
    queryFn: () => teamMockApi.getRemoteTeamMembers(params),
    staleTime: 5 * 60 * 1000,
  });

/**
 * Hook zum Abrufen von Teammitgliedern nach Abteilung
 */
export const useTeamMembersByDepartment = (
  department: string,
  params?: Omit<QueryParams, 'filters'>,
) =>
  useQuery({
    queryKey: ['team-members', 'department', department, params],
    queryFn: () => teamMockApi.getTeamMembersByDepartment(department, params),
    enabled: !!department,
    staleTime: 5 * 60 * 1000,
  });

/**
 * Hook zum Abrufen von Teammitgliedern nach Status
 */
export const useTeamMembersByStatus = (status: string, params?: Omit<QueryParams, 'filters'>) =>
  useQuery({
    queryKey: ['team-members', 'status', status, params],
    queryFn: () => teamMockApi.getTeamMembersByStatus(status, params),
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
  });

/**
 * Hook zum Abrufen der Organisationsstruktur
 */
export const useOrganizationChart = () =>
  useQuery({
    queryKey: ['team-members', 'org-chart'],
    queryFn: () => teamMockApi.getOrganizationChart(),
    staleTime: 30 * 60 * 1000, // 30 Minuten
  });

// ===== MUTATION HOOKS =====

/**
 * Hook zum Erstellen eines neuen Teammitglieds
 */
export const useCreateTeamMember = (options?: {
  onSuccess?: (data: TeamMember) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamMember) => teamMockApi.createTeamMember(data),
    onSuccess: (data) => {
      // Invalidiere relevante Queries
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members', 'stats'] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

/**
 * Hook zum Aktualisieren eines Teammitglieds
 */
export const useUpdateTeamMember = (options?: {
  onSuccess?: (data: TeamMember) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTeamMember) => {
      if (!data.id) throw new Error('Team member ID is required');
      return teamMockApi.updateTeamMember(data.id, data);
    },
    onSuccess: (data) => {
      // Invalidiere spezifisches Mitglied und Listen
      queryClient.invalidateQueries({ queryKey: ['team-members', data.id] });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members', 'stats'] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

/**
 * Hook zum Löschen eines Teammitglieds
 */
export const useDeleteTeamMember = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teamMockApi.deleteTeamMember(id),
    onSuccess: (_, id) => {
      // Entferne aus Cache und invalidiere Listen
      queryClient.removeQueries({ queryKey: ['team-members', id] });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members', 'stats'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

/**
 * Hook zum Aktualisieren des Status eines Teammitglieds
 */
export const useUpdateTeamMemberStatus = (options?: {
  onSuccess?: (data: TeamMember) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' | 'vacation' }) =>
      teamMockApi.updateTeamMemberStatus(id, status),
    onSuccess: (data, variables) => {
      // Invalidiere relevante Queries
      queryClient.invalidateQueries({ queryKey: ['team-members', data.id] });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      queryClient.invalidateQueries({ queryKey: ['team-members', 'status', variables.status] });
      queryClient.invalidateQueries({ queryKey: ['team-members', 'stats'] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
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
    onSettled: (data, error, variables, context) => {
      if (error && context?.previousMember) {
        queryClient.setQueryData(['team-members', variables.id], context.previousMember);
      }
    },
  });
};

/**
 * Hook zum Zurücksetzen der Mock-Daten
 */
export const useResetTeamMembers = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => teamMockApi.resetData(),
    onSuccess: () => {
      // Invalidiere alle Team-bezogenen Queries
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};
