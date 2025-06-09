// src/features/team/dashboard-table/model/types.ts
import type { TeamMember } from '~/entities/team';

export type DashboardTableProps = {
  className?: string;
  onMemberClick?: (member: TeamMember) => void;
};

export type TableStatsProps = {
  total: number;
  active: number;
  remote: number;
};
