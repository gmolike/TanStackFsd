// Re-export everything from model
export * from './model/labels';
export * from './model/options';
export * from './model/schema';
// src/entities/team/api/index.ts

// Export all API hooks
export * from './api/useApi';

// Export mock data generators for testing
export {
  mockTeamMembers,
  generateTeamMember,
  generateTeamMembers,
  generateFullTeam,
} from './api/mock-data';

// Export mock API for direct usage in tests
export { teamMockApi } from './api/mock-api';
