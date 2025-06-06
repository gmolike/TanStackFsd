import type { TeamMember } from '~/entities/team';
import { TeamMemberCard } from '~/entities/team/';

type CardViewProps = {
  teamMembers: Array<TeamMember>;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
  onClick: (member: TeamMember) => void;
};

export const CardView = ({ teamMembers, onEdit, onDelete, onClick }: CardViewProps) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {teamMembers.map((member) => (
      <TeamMemberCard
        key={member.id}
        member={member}
        onEdit={() => onEdit(member)}
        onDelete={() => onDelete(member)}
        onClick={() => onClick(member)}
      />
    ))}
  </div>
);
