// src/shared/ui/data-table/hooks/useTableState.ts
import { useState } from 'react';

import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table';

import type { TableState, UseTableStateReturn } from '../types';

/**
 * Hook-Props
 */
type UseTableStateProps = {
  /** Standard-Sortierung */
  defaultSorting?: SortingState;
  /** Standard-Spalten-Sichtbarkeit */
  defaultColumnVisibility?: VisibilityState;
  /** Ob die Tabelle expandierbar ist */
  expandable?: boolean;
};

/**
 * Hook für zentrales Table State Management
 *
 * @param props - Konfiguration für den initialen State
 * @returns State und Actions für die Tabelle
 */
export const useTableState = ({
  defaultSorting = [],
  defaultColumnVisibility = {},
  expandable = false,
}: UseTableStateProps = {}): UseTableStateReturn => {
  // Individual State Pieces
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [isExpanded, setIsExpanded] = useState(!expandable);

  /**
   * Setzt alle Filter zurück
   */
  const resetFilters = () => {
    setColumnFilters([]);
    setGlobalFilter('');
  };

  /**
   * Toggle Expand/Collapse State
   */
  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  // Kombinierter State
  const state: TableState = {
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    globalFilter,
    isExpanded,
  };

  // Actions
  const actions = {
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setRowSelection,
    setGlobalFilter,
    toggleExpanded,
    resetFilters,
  };

  return { state, actions };
};
