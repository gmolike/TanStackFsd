// src/pages/team/list/ui/card-view.tsx
import { TeamList } from '~/widgets/team-list';

import type { TeamMember } from '~/entities/team';

interface TeamCardViewProps {
  teamMembers: Array<TeamMember>;
}

export function TeamCardView({ teamMembers }: TeamCardViewProps) {
  return <TeamList teamMembers={teamMembers} />;
}
