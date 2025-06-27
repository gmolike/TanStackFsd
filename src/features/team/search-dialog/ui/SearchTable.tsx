// src/features/team/search-dialog/ui/SearchTable.tsx
import { useMemo } from 'react';

import { teamTableDefinition, useTeamMembers } from '~/entities/team';

import { DataTable } from '~/shared/ui/dataTable';

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

  return (
    <DataTable
      tableDefinition={teamTableDefinition}
      selectableColumns={['firstName', 'email', 'role', 'department']}
      data={filteredMembers}
      isLoading={isLoading}
      searchPlaceholder="Nach Name, E-Mail oder Position suchen..."
      onRowClick={onMemberSelect}
      selectedRowId={selectedMemberId}
      pageSize={10}
      showColumnToggle={true}
      showColumnToggleText={false}
      containerClassName="max-h-[450px]"
      className="h-full"
      stickyHeader={true}
    />
  );
};
