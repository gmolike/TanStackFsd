// src/pages/team/list/ui/table-view.tsx
import { useNavigate } from '@tanstack/react-router';

import type { TeamMember } from '~/entities/team';

import { DataTable, teamColumns } from '~/shared/ui/data-table';

interface TeamTableViewProps {
  teamMembers: Array<TeamMember>;
}

export function TeamTableView({ teamMembers }: TeamTableViewProps) {
  const navigate = useNavigate();

  const handleRowClick = (member: TeamMember) => {
    navigate({ to: '/team/$memberId', params: { memberId: member.id } });
  };

  return (
    <DataTable
      columns={teamColumns}
      data={teamMembers}
      searchKey="name"
      onRowClick={handleRowClick}
    />
  );
}
