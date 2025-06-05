// src/pages/team/editor/api/usePageMutations.ts
import { useNavigate } from '@tanstack/react-router';

import type { CreateTeamMember, UpdateTeamMember } from '~/entities/team';
import { useCreateTeamMember, useUpdateTeamMember } from '~/entities/team';

import { toast } from '~/shared/hooks/use-toast';

/**
 * Combined mutations hook for team editor page
 * Handles both create and update operations with navigation
 */
export const useTeamEditorMutations = () => {
  const navigate = useNavigate();

  // Create mutation with navigation on success
  const createMutation = useCreateTeamMember({
    onSuccess: (data) => {
      toast({
        title: 'Teammitglied erstellt',
        description: `${data.firstName} ${data.lastName} wurde erfolgreich hinzugefügt.`,
      });
      // Navigate to detail page after creation
      navigate({ to: '/team/$memberId', params: { memberId: data.id } });
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Erstellen',
        description: error.message || 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    },
  });

  // Update mutation with navigation on success
  const updateMutation = useUpdateTeamMember({
    onSuccess: (data) => {
      toast({
        title: 'Änderungen gespeichert',
        description: 'Die Daten wurden erfolgreich aktualisiert.',
      });
      // Navigate to detail page after update
      navigate({ to: '/team/$memberId', params: { memberId: data.id } });
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Speichern',
        description: error.message || 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    },
  });

  return {
    // Mutation functions
    createMember: createMutation.mutate,
    updateMember: updateMutation.mutate,

    // Async mutation functions (return promises)
    createMemberAsync: createMutation.mutateAsync,
    updateMemberAsync: updateMutation.mutateAsync,

    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isLoading: createMutation.isPending || updateMutation.isPending,

    // Error states
    createError: createMutation.error,
    updateError: updateMutation.error,

    // Reset functions
    resetCreate: createMutation.reset,
    resetUpdate: updateMutation.reset,

    // Combined save function that determines create vs update
    saveMember: (data: CreateTeamMember | UpdateTeamMember) => {
      if ('id' in data && data.id) {
        updateMutation.mutate(data);
      } else {
        createMutation.mutate(data as CreateTeamMember);
      }
    },

    // Async save function
    saveMemberAsync: async (data: CreateTeamMember | UpdateTeamMember) => {
      if ('id' in data && data.id) {
        return updateMutation.mutateAsync(data);
      } else {
        return createMutation.mutateAsync(data as CreateTeamMember);
      }
    },
  };
};

/**
 * Hook for bulk operations on team members
 */
export const useTeamBulkOperations = () => {
  const navigate = useNavigate();

  // Here you could add bulk update/delete operations
  // For now, we'll provide a structure for future expansion

  return {
    // Bulk status update
    updateMultipleStatuses: async (
      memberIds: Array<string>,
      newStatus: 'active' | 'inactive' | 'vacation',
    ) => {
      // This would call a bulk update API endpoint
      // For now, it's a placeholder
      toast({
        title: 'Bulk-Operation',
        description: `${memberIds.length} Mitglieder würden auf Status "${newStatus}" aktualisiert (nicht implementiert)`,
      });
    },

    // Bulk delete
    deleteMultipleMembers: async (memberIds: Array<string>) => {
      // This would call a bulk delete API endpoint
      // For now, it's a placeholder
      toast({
        title: 'Bulk-Löschung',
        description: `${memberIds.length} Mitglieder würden gelöscht (nicht implementiert)`,
        variant: 'destructive',
      });
    },

    // Navigate back to list after bulk operation
    navigateToList: () => navigate({ to: '/team' }),
  };
};
