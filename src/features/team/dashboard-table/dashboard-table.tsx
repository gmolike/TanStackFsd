// src/features/team/dashboard-table/dashboard-table.tsx
import { useNavigate } from '@tanstack/react-router';

import type { TeamMember } from '~/entities/team';
import {
  createDashboardColumns,
  dashboardColumnVisibility,
  teamTableLabels,
  useTeamMembers,
} from '~/entities/team';

import { Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';
import { DataTable } from '~/shared/ui/data-table';

import type { DashboardTableProps } from './model/types';
import { TableHeader } from './ui/table-header';

/**
 * Dashboard Team-Tabelle mit erweiterbarer Ansicht
 * @component
 */
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

  // Nutze Dashboard-spezifische Columns (ohne Actions standardmäßig)
  const columns = createDashboardColumns();

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Team Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <TableHeader {...stats} />

          <DataTable
            // Key nur notwendig wegen des Race Condition Bugs
            key={`team-table-${teamMembers.length}-${isLoading}`}
            // Basis Props
            columns={columns}
            data={teamMembers}
            // Loading State
            withSkeleton
            isLoading={isLoading}
            // Expandable Feature für Dashboard
            expandable
            initialRowCount={3}
            // Interaktion
            onRowClick={handleMemberClick}
            onAddClick={handleAddClick}
            // Suche
            searchPlaceholder="Nach Namen, E-Mail oder Rolle suchen..."
            // UI Anpassungen
            columnLabels={teamTableLabels}
            defaultColumnVisibility={dashboardColumnVisibility}
          />
        </CardContent>
      </Card>
    </div>
  );
};
