// src/features/team/dashboard-table/ui/columns.tsx
import type { ColumnDef } from '@tanstack/react-table';
import { Mail, Phone } from 'lucide-react';

import type { TeamMember } from '~/entities/team';
import { TeamStatusBadge } from '~/entities/team';

/**
 * Spalten-Definition für Dashboard Team-Tabelle
 */
export const createDashboardColumns = (): Array<ColumnDef<TeamMember>> => [
  {
    id: 'name',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: 'Name',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </div>
        <div className="text-sm text-muted-foreground">{row.original.role}</div>
      </div>
    ),
  },
  {
    accessorKey: 'department',
    header: 'Abteilung',
  },
  {
    accessorKey: 'email',
    header: 'Kontakt',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-sm">
          <Mail className="h-3 w-3" />
          <span className="truncate">{row.original.email}</span>
        </div>
        {row.original.phone && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{row.original.phone}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <TeamStatusBadge status={row.original.status} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'remoteWork',
    header: 'Remote',
    cell: ({ row }) => <span className="text-sm">{row.original.remoteWork ? '✓' : '-'}</span>,
  },
];
