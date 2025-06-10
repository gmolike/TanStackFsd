// entities/team/index.ts

// UI Components
export type { MemberCardProps as TeamMemberCardProps } from './ui/member-card';
export { MemberCard as TeamMemberCard } from './ui/member-card';
export type {
  ExtendedMemberInfoProps as TeamExtendedMemberInfoProps,
  MemberInfoProps as TeamMemberInfoProps,
} from './ui/member-info';
export {
  ExtendedMemberInfo as TeamExtendedMemberInfo,
  MemberInfo as TeamMemberInfo,
} from './ui/member-info';
export type { StatusBadgeProps as TeamStatusBadgeProps } from './ui/status-badge';
export { StatusBadge as TeamStatusBadge } from './ui/status-badge';

// Model - Schema
export type {
  Address,
  CreateTeamMember,
  CreateTeamMemberFormData,
  TeamFormData,
  TeamMember,
  TeamMemberFormData,
  UpdateTeamMember,
  UpdateTeamMemberFormData,
} from './model/schema';
export * from './model/schema';

// Model - Labels
export { dashboardLabels, teamLabels } from './model/labels';

// Model - Table Definition
export { teamColumnSets, teamTableDefinition } from './model/table-definition';

// Model - Options
export * from './model/options';

// API Hooks
export {
  useCreateTeamMember,
  useDeleteTeamMember,
  useOrganizationChart,
  useRemoteTeamMembers,
  useResetTeamMembers,
  useTeamMember,
  useTeamMembers,
  useTeamMembersByDepartment,
  useTeamMembersByStatus,
  useTeamStats,
  useUpdateTeamMember,
  useUpdateTeamMemberStatus,
} from './api/useApi';

// Mock API
export { teamMockApi } from './api/mock-api';

// Mock Data Generators
export {
  generateFullTeam,
  generateTeamByDepartment,
  generateTeamMember,
  generateTeamMembers,
  mockTeamMembers,
} from './api/mock-data';
