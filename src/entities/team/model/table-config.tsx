// src/entities/team/model/table-config.tsx
import type { ColumnDef } from '@tanstack/react-table';

// Import aller Cell Components
import {
  ActionsCell,
  DashboardContactCell,
  DashboardNameCell,
  DepartmentCell,
  EmailCell,
  NameCell,
  PhoneCell,
  RemoteWorkCell,
  RoleCell,
  StatusCell,
} from '../ui/table-cells';
import { SimpleHeader, SortableHeader } from '../ui/table-header';

import { teamTableLabels } from './labels';
import type { TeamMember } from './schema';

/**
 * Team Table Column Definitions
 * @description Explizite Zuordnung von Komponenten zu Spalten
 */

// Standard Team Columns
export const createTeamColumnDefs = (
  onEdit?: (member: TeamMember) => void,
  onDelete?: (member: TeamMember) => void,
): Array<ColumnDef<TeamMember>> => [
  {
    id: 'name',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: ({ column }) => <SortableHeader column={column} label={teamTableLabels.name} />,
    cell: ({ row }) => <NameCell member={row.original} />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <SortableHeader column={column} label={teamTableLabels.email} />,
    cell: ({ row }) => <EmailCell email={row.getValue('email')} />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'role',
    header: () => <SimpleHeader label={teamTableLabels.role} />,
    cell: ({ row }) => <RoleCell role={row.getValue('role')} />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'department',
    header: ({ column }) => <SortableHeader column={column} label={teamTableLabels.department} />,
    cell: ({ row }) => <DepartmentCell department={row.getValue('department')} />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'phone',
    header: () => <SimpleHeader label={teamTableLabels.phone} />,
    cell: ({ row }) => <PhoneCell phone={row.getValue('phone')} />,
    enableGlobalFilter: false,
  },
  {
    accessorKey: 'status',
    header: () => <SimpleHeader label={teamTableLabels.status} />,
    cell: ({ row }) => <StatusCell status={row.getValue('status')} />,
    enableGlobalFilter: false,
  },
  // Actions nur wenn Callbacks vorhanden
  ...(onEdit || onDelete
    ? [
        {
          id: 'actions',
          header: () => <SimpleHeader label={teamTableLabels.actions} />,
          cell: ({ row }: { row: any }) => (
            <ActionsCell member={row.original} onEdit={onEdit} onDelete={onDelete} />
          ),
          enableHiding: false,
          enableGlobalFilter: false,
        },
      ]
    : []),
];

// Dashboard-spezifische Columns
export const createDashboardColumnDefs = (): Array<ColumnDef<TeamMember>> => [
  {
    id: 'name',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: () => <SimpleHeader label={teamTableLabels.name} />,
    cell: ({ row }) => <DashboardNameCell member={row.original} />,
  },
  {
    accessorKey: 'department',
    header: () => <SimpleHeader label={teamTableLabels.department} />,
    cell: ({ row }) => <DepartmentCell department={row.getValue('department')} />,
  },
  {
    id: 'contact',
    header: () => <SimpleHeader label={teamTableLabels.contact} />,
    cell: ({ row }) => <DashboardContactCell member={row.original} />,
  },
  {
    accessorKey: 'status',
    header: () => <SimpleHeader label={teamTableLabels.status} />,
    cell: ({ row }) => <StatusCell status={row.getValue('status')} />,
  },
  {
    accessorKey: 'remoteWork',
    header: () => <SimpleHeader label={teamTableLabels.remoteWork} />,
    cell: ({ row }) => <RemoteWorkCell remoteWork={row.original.remoteWork} />,
  },
];

// Column Visibility Configuration
export const defaultColumnVisibility = {
  name: true,
  email: true,
  role: true,
  department: true,
  phone: false,
  status: true,
  actions: true,
};

// Dashboard Column Visibility
export const dashboardColumnVisibility = {
  name: true,
  department: true,
  contact: true,
  status: true,
  remoteWork: true,
};
