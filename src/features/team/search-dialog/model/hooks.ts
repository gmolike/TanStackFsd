// src/features/team/search-dialog/model/hooks.ts
import { useCallback, useState } from 'react';

import type { TeamMember } from '~/entities/team';

import type { SearchDialogState } from './types';

/**
 * Hook für Search Dialog State Management
 */
export const useSearchDialogState = () => {
  const [state, setState] = useState<SearchDialogState>({
    selectedMember: null,
    showDetails: false,
  });

  const selectMember = useCallback((member: TeamMember) => {
    setState({
      selectedMember: member,
      showDetails: true,
    });
  }, []);

  const clearSelection = useCallback(() => {
    setState({
      selectedMember: null,
      showDetails: false,
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      selectedMember: null,
      showDetails: false,
    });
  }, []);

  return {
    state,
    actions: {
      selectMember,
      clearSelection,
      reset,
    },
  };
};
