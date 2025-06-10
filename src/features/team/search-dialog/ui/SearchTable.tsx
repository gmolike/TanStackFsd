// src/features/team/search-dialog/ui/SearchTable.tsx
import { useMemo } from 'react';

import { createTeamColumns, teamTableLabels, useTeamMembers } from '~/entities/team';

import { DataTable } from '~/shared/ui/data-table';

import type { SearchTableProps } from '../model/types';

/**
 * Such-Tabelle für Team-Mitglieder
 *
 * @component
 * @param props - SearchTable Konfiguration
 */
export const SearchTable = ({
  onMemberSelect,
  selectedMemberId,
  excludeIds = [],
}: SearchTableProps) => {
  const { data, isLoading } = useTeamMembers();

  // Filtere ausgeschlossene IDs
  const filteredMembers = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((member) => !excludeIds.includes(member.id));
  }, [data?.data, excludeIds]);

  // Verwende die Standard Team Columns ohne Actions
  const columns = useMemo(() => createTeamColumns(), []);

  // Angepasste Visibility für Dialog
  const dialogColumnVisibility = {
    name: true,
    email: true,
    role: true,
    department: true,
    phone: false,
    status: false,
    actions: false, // Keine Actions im Such-Dialog
  };

  return (
    <DataTable
      columns={columns}
      data={filteredMembers}
      isLoading={isLoading}
      withSkeleton
      skeletonRows={5}
      // Suche ist bereits in der Toolbar integriert
      searchPlaceholder="Nach Name, E-Mail oder Position suchen..."
      // Zeilen-Klick Handler
      onRowClick={onMemberSelect}
      // Hervorhebung der ausgewählten Zeile
      selectedRowId={selectedMemberId}
      // Kompakte Ansicht für Dialog
      pageSize={8}
      // Spalten-Konfiguration
      columnLabels={teamTableLabels}
      defaultColumnVisibility={dialogColumnVisibility}
      showColumnToggle={true}
      showColumnToggleText={false}
      // Container-Styling für Overflow
      containerClassName="max-h-[450px]"
      className="h-full"
      // Sticky Header für bessere UX beim Scrollen
      stickyHeader={true}
    />
  );
};
