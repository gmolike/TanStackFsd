// src/pages/team/list/api/usePageQueries.ts
import { useRemoteTeamMembers, useTeamMembers, useTeamStats } from '~/entities/team';

import type { QueryParams } from '~/shared/mock';

/**
 * Combined hook for team list page data
 * Fetches both team members and statistics
 */
export const useTeamListPageData = (params?: QueryParams) => {
  const membersQuery = useTeamMembers(params);
  const statsQuery = useTeamStats();

  return {
    // Member data
    members: membersQuery.data?.data || [],
    totalMembers: membersQuery.data?.total || 0,
    currentPage: membersQuery.data?.page || 1,
    totalPages: membersQuery.data?.totalPages || 1,
    hasNextPage: membersQuery.data?.hasNextPage || false,
    hasPreviousPage: membersQuery.data?.hasPreviousPage || false,

    // Statistics
    stats: statsQuery.data,

    // Loading states
    isLoading: membersQuery.isLoading || statsQuery.isLoading,
    isMembersLoading: membersQuery.isLoading,
    isStatsLoading: statsQuery.isLoading,

    // Error states
    error: membersQuery.error || statsQuery.error,
    membersError: membersQuery.error,
    statsError: statsQuery.error,

    // Refetch functions
    refetch: () => {
      membersQuery.refetch();
      statsQuery.refetch();
    },
    refetchMembers: membersQuery.refetch,
    refetchStats: statsQuery.refetch,
  };
};

/**
 * Hook for department-specific team members
 */
export const useTeamByDepartment = (department: string) => {
  const allMembersQuery = useTeamMembers({
    filters: [{ field: 'department', operator: 'eq', value: department }],
    sort: { field: 'lastName', order: 'asc' },
  });

  return {
    members: allMembersQuery.data?.data || [],
    total: allMembersQuery.data?.total || 0,
    isLoading: allMembersQuery.isLoading,
    error: allMembersQuery.error,
    refetch: allMembersQuery.refetch,
  };
};

/**
 * Hook for remote team members with pagination
 */
export const useRemoteTeamWithPagination = (page: number = 1, limit: number = 10) => {
  const remoteQuery = useRemoteTeamMembers({ page, limit });

  return {
    members: remoteQuery.data?.data || [],
    pagination: {
      page: remoteQuery.data?.page || 1,
      limit: remoteQuery.data?.limit || limit,
      total: remoteQuery.data?.total || 0,
      totalPages: remoteQuery.data?.totalPages || 1,
    },
    isLoading: remoteQuery.isLoading,
    error: remoteQuery.error,
    refetch: remoteQuery.refetch,
  };
};
