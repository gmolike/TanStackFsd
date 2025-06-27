/* eslint-disable react-refresh/only-export-components */
import type { TableDefinition } from '~/shared/ui/dataTable';
import { BooleanCell, DateCell, EmailCell, PhoneCell } from '~/shared/ui/dataTable';

import { StatusBadge } from '../ui/status-badge';

import { teamLabels } from './labels';
import type { TeamMember } from './schema';

// Name Cell für Team
const TeamNameCell = ({ row }: { row: TeamMember }) => (
  <div className="font-medium">
    {row.firstName} {row.lastName}
  </div>
);

// Status Cell Wrapper
const TeamStatusCell = ({ value }: { value: unknown }) => (
  <StatusBadge status={value as TeamMember['status']} />
);

/**
 * Team Table Definition
 * Zentrale Definition aller möglichen Spalten
 */
export const teamTableDefinition: TableDefinition<TeamMember> = {
  labels: teamLabels,
  fields: [
    {
      id: 'firstName',
      cell: TeamNameCell,
    },
    {
      id: 'email',
      cell: EmailCell,
    },
    {
      id: 'role',
    },
    {
      id: 'department',
    },
    {
      id: 'phone',

      cell: PhoneCell,
    },
    {
      id: 'status',
      cell: TeamStatusCell,
    },
    {
      id: 'remoteWork',
      cell: BooleanCell,
    },
    {
      id: 'startDate',

      cell: DateCell,
    },
    {
      id: 'actions',
      sortable: false,
      searchable: false,
      cell: 'actions',
    },
  ],
};

/**
 * Vordefinierte Spalten-Sets für verschiedene Ansichten
 * Direkt als Arrays ohne as const für bessere Kompatibilität
 */
export const teamColumnSets = {
  // Vollständige Tabelle
  full: ['name', 'email', 'role', 'department', 'phone', 'status', 'actions'] as Array<string>,

  // Kompakte Ansicht
  compact: ['name', 'email', 'department', 'status'] as Array<string>,

  // Dashboard Ansicht
  dashboard: ['name', 'department', 'status', 'remoteWork'] as Array<string>,

  // Ohne Actions (z.B. für Read-Only)
  readOnly: ['name', 'email', 'role', 'department', 'phone', 'status'] as Array<string>,
};
