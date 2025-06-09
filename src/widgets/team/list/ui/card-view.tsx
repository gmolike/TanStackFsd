// src/widgets/team/list/ui/card-view.tsx
import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { TeamDeleteDialog } from '~/features/team';

import type { TeamMember } from '~/entities/team';
import { TeamMemberCard } from '~/entities/team';

type CardViewProps = {
  teamMembers: Array<TeamMember>;
  onClick: (member: TeamMember) => void;
  refetch?: () => void;
};

export const CardView = ({ teamMembers, onClick, refetch }: CardViewProps) => {
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

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onEdit={() => handleEdit(member)}
            onDelete={() => handleDelete(member)}
            onClick={() => onClick(member)}
          />
        ))}
      </div>

      <TeamDeleteDialog
        member={memberToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
};
