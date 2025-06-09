// src/features/team/search-dialog/ui/SearchTable.tsx
import { useMemo } from 'react';

import { createTeamColumns, useTeamMembers } from '~/entities/team';

import { DataTable } from '~/shared/ui/data-table';

import type { SearchTableProps } from '../model/types';

/**
 * Such-Tabelle für Team-Mitglieder
 *
 * @component
 * @param props - SearchTable Konfiguration
 */
export const SearchTable = ({ onMemberSelect, excludeIds = [] }: SearchTableProps) => {
  const { data, isLoading } = useTeamMembers();

  // Filtere ausgeschlossene IDs
  const filteredMembers = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((member) => !excludeIds.includes(member.id));
  }, [data?.data, excludeIds]);

  // Verwende die Standard Team Columns ohne Actions
  const columns = useMemo(() => createTeamColumns().filter((col) => col.id !== 'actions'), []);

  // Column Labels für den Dialog
  const columnLabels = {
    name: 'Name',
    email: 'E-Mail',
    role: 'Position',
    department: 'Abteilung',
    phone: 'Telefon',
    status: 'Status',
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
      // Kompakte Ansicht für Dialog
      pageSize={8}
      // Spalten-Konfiguration
      columnLabels={columnLabels}
      defaultColumnVisibility={{
        phone: false, // Standardmäßig ausgeblendet
        status: false, // Standardmäßig ausgeblendet
      }}
      showColumnToggle={true}
      showColumnToggleText={false}
      // Entferne Container-Styling
      containerClassName=""
      className=""
    />
  );
};
