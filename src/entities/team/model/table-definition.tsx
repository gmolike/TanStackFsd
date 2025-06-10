// entities/team/model/table-definition.tsx
import type { FieldDefinition, TableDefinition } from '~/shared/ui/data-table';

import { StatusBadge } from '../ui/status-badge';

import { teamLabels } from './labels';
import type { TeamMember } from './schema';

/**
 * Team Table Field Definitions
 * Nutzt explizite accessor functions für alle Felder
 */
const teamFields: Array<FieldDefinition<TeamMember>> = [
  {
    id: 'name',
    // Explizite accessor function für kombinierte Felder
    accessor: (row: TeamMember) => `${row.firstName} ${row.lastName}`,
    sortable: true,
    searchable: true,
  },
  {
    id: 'email',
    accessor: (row: TeamMember) => row.email,
    sortable: true,
    searchable: true,
    cellTemplate: 'email',
  },
  {
    id: 'role',
    accessor: (row: TeamMember) => row.role,
    sortable: false,
    searchable: true,
  },
  {
    id: 'department',
    accessor: (row: TeamMember) => row.department,
    sortable: true,
    searchable: true,
  },
  {
    id: 'phone',
    accessor: (row: TeamMember) => row.phone ?? '',
    sortable: false,
    searchable: false,
    cellTemplate: 'phone',
  },
  {
    id: 'status',
    accessor: (row: TeamMember) => row.status,
    sortable: false,
    searchable: false,
    // Custom Component für Team Status
    cellComponent: StatusBadge,
    cellProps: (value: unknown) => ({ status: value as TeamMember['status'] }),
  },
  {
    id: 'remoteWork',
    accessor: (row: TeamMember) => row.remoteWork || false,
    sortable: false,
    searchable: false,
    cellTemplate: 'boolean',
  },
  {
    id: 'startDate',
    accessor: (row: TeamMember) => row.startDate,
    sortable: true,
    searchable: false,
    cellTemplate: 'date',
  },
  {
    id: 'actions',
    // Actions hat keinen accessor - wird über cellTemplate gehandhabt
    sortable: false,
    searchable: false,
    cellTemplate: 'actions',
  },
];

/**
 * Team Table Definition
 * Zentrale Definition aller möglichen Spalten
 */
export const teamTableDefinition: TableDefinition<TeamMember> = {
  labels: teamLabels,
  fields: teamFields,
};

/**
 * Vordefinierte Spalten-Sets für verschiedene Ansichten
 */
export const teamColumnSets = {
  // Vollständige Tabelle
  full: ['name', 'email', 'role', 'department', 'phone', 'status', 'actions'],

  // Kompakte Ansicht
  compact: ['name', 'email', 'department', 'status'],

  // Dashboard Ansicht
  dashboard: ['name', 'department', 'status', 'remoteWork'],

  // Ohne Actions (z.B. für Read-Only)
  readOnly: ['name', 'email', 'role', 'department', 'phone', 'status'],
} as const;
