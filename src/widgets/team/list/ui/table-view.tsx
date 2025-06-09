// src/widgets/team/list/ui/table-view.tsx
import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { TeamDeleteDialog } from '~/features/team';

import type { TeamMember } from '~/entities/team';
import { createTeamColumns, defaultColumnVisibility, teamTableLabels } from '~/entities/team';

import { DataTable } from '~/shared/ui/data-table';

type Props = {
  teamMembers: Array<TeamMember>;
  onRowClick: (member: TeamMember) => void;
  refetch?: () => void;
};

export const TableView = ({ teamMembers, onRowClick, refetch }: Props) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  const handleEdit = (member: TeamMember) => {
    navigate({ to: '/team/$memberId/edit', params: { memberId: member.id } });
  };

  const handleDelete = (member: TeamMember) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    refetch?.();
  };

  // Nutze die zentral definierten Columns mit Standard-Buttons
  const columns = createTeamColumns(handleEdit, handleDelete);

  return (
    <>
      <DataTable
        columns={columns}
        data={teamMembers}
        searchPlaceholder="Globale Suche nach Namen, E-Mail oder Rolle..."
        onRowClick={onRowClick}
        defaultSorting={[{ id: 'name', desc: false }]}
        defaultColumnVisibility={defaultColumnVisibility}
        columnLabels={teamTableLabels}
        pageSize={10}
        showColumnToggle={true}
        showColumnToggleText={false}
        onAddClick={() => navigate({ to: '/team/new' })}
      />

      <TeamDeleteDialog
        member={memberToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
};
