// src/widgets/team/list/ui/table-view.tsx
import { useState } from 'react';

import { useNavigate, useParams } from '@tanstack/react-router';

import { TeamDeleteDialog } from '~/features/team';

import type { TeamMember } from '~/entities/team';
import { teamColumnSets, teamTableDefinition } from '~/entities/team';

import { DataTable } from '~/shared/ui/data-table';

type Props = {
  teamMembers: Array<TeamMember>;
  onRowClick: (member: TeamMember) => void;
  refetch?: () => void;
};

export const TableView = ({ teamMembers, onRowClick, refetch }: Props) => {
  const navigate = useNavigate();

  const { memberId } = useParams({ strict: false });
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
        // Table Definition
        tableDefinition={teamTableDefinition}
        // Type-safe column selection
        selectableColumns={teamColumnSets.full}
        data={teamMembers}
        // ID handling
        idKey="id"
        selectedId={memberId}
        selectedRowId={memberId}
        // Callbacks
        onRowClick={onRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAddClick}
        // UI Options
        searchPlaceholder="Globale Suche nach Namen, E-Mail oder Rolle..."
        addButtonText="Neues Teammitglied"
        showColumnToggle={true}
        showColumnToggleText={false}
        pageSize={10}
        // Sticky Features
        stickyActionColumn={true}
        stickyHeader={true}
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
