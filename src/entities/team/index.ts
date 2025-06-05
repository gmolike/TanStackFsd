// src/entities/team/index.ts

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
  // API Schemas
  createTeamMemberSchema,
  type TeamFormData,
  // Types
  type TeamMember,
  type TeamMemberFormData,
  // Form Schemas
  teamMemberFormSchema,
  // Basis Schemas
  teamMemberSchema,
  type UpdateTeamMember,
  type UpdateTeamMemberFormData,
  updateTeamMemberFormSchema,
  updateTeamMemberSchema,
} from './model/schema';

// API Hooks - einzeln exportiert für klare Verwendung
export {
  // Mutation Hooks
  useCreateTeamMember,
  useDeleteTeamMember,
  useOrganizationChart,
  useRemoteTeamMembers,
  useResetTeamMembers,
  useTeamMember,
  // Query Hooks
  useTeamMembers,
  useTeamMembersByDepartment,
  useTeamMembersByStatus,
  useTeamStats,
  useUpdateTeamMember,
  useUpdateTeamMemberStatus,
} from './api/useApi';

// Mock-Daten Generatoren als Namespace (für Tests)
export * as teamMockGenerators from './api/mock-data';

// Mock API als Namespace (für direkte Tests)
export * as teamMockApiService from './api/mock-api';
