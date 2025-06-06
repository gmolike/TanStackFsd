// src/entities/team/index.ts
export type { MemberCardProps as TeamMemberCardProps } from './ui/member-card';
export { MemberCard as TeamMemberCard } from './ui/member-card';
export type { MemberInfoProps as TeamMemberInfoProps } from './ui/member-info';
export { MemberInfo as TeamMemberInfo } from './ui/member-info';
export type { StatusBadgeProps as TeamStatusBadgeProps } from './ui/status-badge';
export { StatusBadge as TeamStatusBadge } from './ui/status-badge';

// Model exports
export * from './model/labels';
export * from './model/options';
export * from './model/schema';

// Explizite Schema exports für bessere Übersicht
export {
  type Address,
  addressSchema,
  type CreateTeamMember,
  type CreateTeamMemberFormData,
  createTeamMemberFormSchema,
  createTeamMemberSchema,
  type TeamFormData,
  type TeamMember,
  type TeamMemberFormData,
  teamMemberFormSchema,
  teamMemberSchema,
  type UpdateTeamMember,
  type UpdateTeamMemberFormData,
  updateTeamMemberFormSchema,
  updateTeamMemberSchema,
} from './model/schema';

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

// Mock API direkt exportieren (nicht als namespace)
export { teamMockApi } from './api/mock-api';

// Mock Data Generators
export {
  generateFullTeam,
  generateTeamByDepartment,
  generateTeamMember,
  generateTeamMembers,
  mockTeamMembers,
} from './api/mock-data';
