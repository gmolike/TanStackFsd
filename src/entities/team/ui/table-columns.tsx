// src/entities/team/ui/table-columns.tsx
import type { TeamMember } from '../model/schema';
import {
  createDashboardColumnDefs,
  createTeamColumnDefs,
  dashboardColumnVisibility as dashboardVisibility,
  defaultColumnVisibility as defaultVisibility,
} from '../model/table-config';

/**
 * Team Table Columns
 * @description Exportiert die konfigurierten Tabellen-Spalten für Team-Listen
 */

// Standard Team Columns
export const createTeamColumns = (
  onEdit?: (member: TeamMember) => void,
  onDelete?: (member: TeamMember) => void,
) => createTeamColumnDefs(onEdit, onDelete);

// Dashboard Columns
export const createDashboardColumns = () => createDashboardColumnDefs();

// Export visibility configs mit konsistenten Namen
export const defaultColumnVisibility = defaultVisibility;
export const dashboardColumnVisibility = dashboardVisibility;

// Legacy export für Rückwärtskompatibilität
export const teamColumns = createTeamColumns();
