/**
 * Team member entity type definitions
 */
export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
};
