import { useNavigate } from '@tanstack/react-router';

import type { TeamMember } from '~/entities/team';

import { DataTable } from '~/shared/ui/data-table';
import { createTeamColumns } from '~/shared/ui/data-table/columns/team-columns';

type Props = {
  teamMembers: Array<TeamMember>;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
  onRowClick: (member: TeamMember) => void;
};

const teamColumnLabels: Record<string, string> = {
  name: 'Name',
  email: 'E-Mail',
  role: 'Rolle',
  department: 'Abteilung',
  phone: 'Telefon',
  status: 'Status',
  birthDate: 'Geburtsdatum',
  startDate: 'Eintrittsdatum',
};

export const TableView = ({ teamMembers, onEdit, onDelete, onRowClick }: Props) => {
  const navigate = useNavigate();
  const columns = createTeamColumns(onEdit, onDelete);

  return (
    <DataTable
      columns={columns}
      data={teamMembers}
      searchPlaceholder="Globale Suche nach Namen, E-Mail oder Rolle..."
      onRowClick={onRowClick}
      defaultSorting={[{ id: 'name', desc: false }]}
      defaultColumnVisibility={{
        name: true,
        email: true,
        role: true,
        department: true,
        phone: false,
        status: true,
        actions: true,
      }}
      columnLabels={teamColumnLabels}
      pageSize={10}
      showColumnToggle={true}
      showColumnToggleText={false}
      onAddClick={() => navigate({ to: '/team/new' })}
    />
  );
};
