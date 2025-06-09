// src/entities/team/index.ts

// UI Components
export type { MemberCardProps as TeamMemberCardProps } from './ui/member-card';
export { MemberCard as TeamMemberCard } from './ui/member-card';
export type { MemberInfoProps as TeamMemberInfoProps } from './ui/member-info';
export type { ExtendedMemberInfoProps as TeamExtendedMemberInfoProps } from './ui/member-info';
export { MemberInfo as TeamMemberInfo } from './ui/member-info';
export { ExtendedMemberInfo as TeamExtendedMemberInfo } from './ui/member-info';
export type { StatusBadgeProps as TeamStatusBadgeProps } from './ui/status-badge';
export { StatusBadge as TeamStatusBadge } from './ui/status-badge';

// UI Table Components
export { createDashboardColumns, createTeamColumns } from './ui/table-columns';
export { dashboardColumnVisibility, defaultColumnVisibility } from './ui/table-columns';

// UI Table Cells (für custom usage)
export * from './ui/table-cells';

// UI Table Headers (für custom usage)
export * from './ui/table-header';

// Model exports - Labels
export type {
  TeamAddressLabelKey,
  TeamInfoLabelKey,
  TeamLabelKey,
  TeamStatusLabelKey,
  TeamTableLabelKey,
} from './model/labels';
export {
  getAddressLabel,
  getStatusLabel,
  getTableLabel,
  getTeamLabel,
  teamAddressLabels,
  teamBaseLabels,
  teamInfoLabels,
  teamLabels,
  teamStatusLabels,
  teamTableLabels,
} from './model/labels';

// Model exports - Column Metadata
export type { ColumnMetadata } from './model/column-metadata';
export {
  dashboardColumnsMetadata,
  getColumnMetadata,
  getDefaultVisibility,
  getSearchableColumns,
  teamColumnsMetadata,
} from './model/column-metadata';

// Model exports - Options
export * from './model/options';

// Model exports - Schema
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

// Mock API direkt exportieren
export { teamMockApi } from './api/mock-api';

// Mock Data Generators
export {
  generateFullTeam,
  generateTeamByDepartment,
  generateTeamMember,
  generateTeamMembers,
  mockTeamMembers,
} from './api/mock-data';
