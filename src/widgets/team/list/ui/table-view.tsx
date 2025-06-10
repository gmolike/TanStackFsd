// src/widgets/team/list/ui/table-view.tsx
import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { TeamDeleteDialog } from '~/features/team';

import type { TeamMember } from '~/entities/team';
import { teamTableDefinition } from '~/entities/team';

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

  const handleAddClick = () => {
    navigate({ to: '/team/new' });
  };

  return (
    <>
      <DataTable
        // Neue Table Definition
        tableDefinition={teamTableDefinition}
        selectableColumns={['name', 'email', 'role', 'department', 'phone', 'status', 'actions']}
        data={teamMembers}
        // Callbacks
        onRowClick={onRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAddClick}
        // UI Options
        searchPlaceholder="Globale Suche nach Namen, E-Mail oder Rolle..."
        showColumnToggle={true}
        showColumnToggleText={false}
        pageSize={10}
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
