// src/pages/team/index.ts

// Page Components
export { TeamDetailPage } from './detail/ui/page';
export { TeamEditorPage } from './editor/ui/page';
export { TeamListPage } from './list/ui/page';

// Re-export API hooks for convenience (optional)
// This allows pages to import both components and hooks from one place
export {
  useCreateTeamMember,
  useDeleteTeamMember,
  useTeamMember,
  useTeamMembers,
  useUpdateTeamMember,
  useUpdateTeamMemberStatus,
} from '~/entities/team';
