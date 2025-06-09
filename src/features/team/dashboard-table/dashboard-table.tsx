// src/features/team/dashboard-table/dashboard-table.tsx
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

import type { TeamMember } from '~/entities/team';
import { useTeamMembers } from '~/entities/team';

import { Alert, AlertDescription, Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';
import { createTeamColumns } from '~/shared/ui/data-table/columns/team-columns';
import { ExpandableDataTable } from '~/shared/ui/expandable-data-table';

import type { DashboardTableProps } from './model/types';
import { TableHeader } from './ui/table-header';

// Column Labels für Team
const teamColumnLabels: Record<string, string> = {
  name: 'Name',
  email: 'E-Mail',
  role: 'Rolle',
  department: 'Abteilung',
  phone: 'Telefon',
  status: 'Status',
  actions: 'Aktionen',
};

/**
 * Dashboard Team-Tabelle mit erweiterbarer Ansicht
 * @component
 */
export const DashboardTable = ({ className, onMemberClick }: DashboardTableProps) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useTeamMembers();

  const handleMemberClick = (member: TeamMember) => {
    if (onMemberClick) {
      onMemberClick(member);
    } else {
      navigate({ to: '/team/$memberId', params: { memberId: member.id } });
    }
  };

  const handleEdit = (member: TeamMember) => {
    navigate({ to: '/team/$memberId/edit', params: { memberId: member.id } });
  };

  const handleDelete = (member: TeamMember) => {
    // Hier würde normalerweise ein Delete-Dialog geöffnet
    console.log('Delete:', member);
  };

  const handleAddClick = () => {
    navigate({ to: '/team/new' });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertDescription>
              Fehler beim Laden der Teammitglieder: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const teamMembers = data?.data || [];
  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter((m) => m.status === 'active').length,
    remote: teamMembers.filter((m) => m.remoteWork).length,
  };

  // Verwende die gleichen Columns wie in der großen Übersicht
  const columns = createTeamColumns(handleEdit, handleDelete);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Team Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <TableHeader {...stats} />

          <ExpandableDataTable
            columns={columns}
            data={teamMembers}
            initialRowCount={3}
            onRowClick={handleMemberClick}
            containerClassName="max-h-[50vh]" // 50% des Viewports
            searchPlaceholder="Nach Namen, E-Mail oder Rolle suchen..."
            columnLabels={teamColumnLabels}
            showColumnToggle={true}
            onAddClick={handleAddClick}
            defaultColumnVisibility={{
              name: true,
              email: true,
              role: true,
              department: true,
              phone: false, // Phone initial ausgeblendet
              status: true,
              actions: true,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
