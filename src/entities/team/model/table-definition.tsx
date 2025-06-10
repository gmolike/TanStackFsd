// entities/team/model/table-definition.tsx
import type { FieldDefinition, TableDefinition } from '~/shared/ui/data-table';
import {
  BooleanCell,
  DateCell,
  EmailCell,
  PhoneCell,
} from '~/shared/ui/data-table/components/CellTemplates';

import { StatusBadge } from '../ui/status-badge';

import { teamLabels } from './labels';
import type { TeamMember } from './schema';

// Name Cell für Team
const TeamNameCell = ({ row }: { value: unknown; row: TeamMember }) => (
  <div className="font-medium">
    {row.firstName} {row.lastName}
  </div>
);

// Status Cell Wrapper
const TeamStatusCell = ({ value }: { value: unknown; row: TeamMember }) => (
  <StatusBadge status={value as TeamMember['status']} />
);

/**
 * Team Table Field Definitions
 * Nutzt direkte Komponenten statt Templates
 */
const teamFields: Array<FieldDefinition<TeamMember>> = [
  {
    id: 'name',
    accessor: (row: TeamMember) => `${row.firstName} ${row.lastName}`,
    sortable: true,
    searchable: true,
    cell: TeamNameCell,
  },
  {
    id: 'email',
    accessor: (row: TeamMember) => row.email,
    sortable: true,
    searchable: true,
    cell: EmailCell as React.ComponentType<{ value: unknown; row: TeamMember }>,
  },
  {
    id: 'role',
    accessor: (row: TeamMember) => row.role,
    sortable: false,
    searchable: true,
    cell: 'default', // Nutzt Standard Text Cell
  },
  {
    id: 'department',
    accessor: (row: TeamMember) => row.department,
    sortable: true,
    searchable: true,
    cell: 'default', // Nutzt Standard Text Cell
  },
  {
    id: 'phone',
    accessor: (row: TeamMember) => row.phone ?? '',
    sortable: false,
    searchable: false,
    cell: PhoneCell as React.ComponentType<{ value: unknown; row: TeamMember }>,
  },
  {
    id: 'status',
    accessor: (row: TeamMember) => row.status,
    sortable: false,
    searchable: false,
    cell: TeamStatusCell,
  },
  {
    id: 'remoteWork',
    accessor: (row: TeamMember) => row.remoteWork || false,
    sortable: false,
    searchable: false,
    cell: BooleanCell as React.ComponentType<{ value: unknown; row: TeamMember }>,
  },
  {
    id: 'startDate',
    accessor: (row: TeamMember) => row.startDate,
    sortable: true,
    searchable: false,
    cell: DateCell as React.ComponentType<{ value: unknown; row: TeamMember }>,
  },
  {
    id: 'actions',
    sortable: false,
    searchable: false,
    // Spezieller Marker für Actions - wird von DataTable erkannt
    cell: 'actions' as any,
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
