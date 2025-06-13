// src/features/team/dashboard-table/dashboard-table.tsx
import { useNavigate } from '@tanstack/react-router';

import type { TeamMember } from '~/entities/team';
import { teamColumnSets, teamTableDefinition, useTeamMembers } from '~/entities/team';

import { Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';
import { DataTable } from '~/shared/ui/data-table';

import type { DashboardTableProps } from './model/types';
import { TableHeader } from './ui/table-header';

export const DashboardTable = ({ className, onMemberClick }: DashboardTableProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useTeamMembers();

  const teamMembers = data?.data || [];

  // Stats für den Header
  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter((m) => m.status === 'active').length,
    remote: teamMembers.filter((m) => m.remoteWork).length,
  };

  const handleMemberClick = (member: TeamMember) => {
    if (onMemberClick) {
      onMemberClick(member);
    } else {
      navigate({ to: '/team/$memberId', params: { memberId: member.id } });
    }
  };

  const handleAddClick = () => {
    navigate({ to: '/team/new' });
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Team Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <TableHeader {...stats} />

          <DataTable
            // Table Definition
            tableDefinition={teamTableDefinition}
            // Type-safe column selection for dashboard
            selectableColumns={teamColumnSets.dashboard}
            data={teamMembers}
            // ID handling - KEINE selectedId hier, da wir nicht auf einer Detail-Route sind
            idKey="id"
            // Loading State
            isLoading={isLoading}
            // Dashboard specific features
            expandable
            initialRowCount={3}
            expandButtonText={{
              expand: 'Alle Teammitglieder anzeigen',
              collapse: 'Weniger anzeigen',
            }}
            pageSize={10}
            // Callbacks
            onRowClick={handleMemberClick}
            onAdd={handleAddClick}
            // UI Options
            searchPlaceholder="Nach Namen, E-Mail oder Rolle suchen..."
            addButtonText="Neues Teammitglied"
            showColumnToggle={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};
