// src/shared/ui/data-table/columns/team-columns.tsx
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';

import type { TeamMember } from '~/entities/team';

import { Button } from '~/shared/shadcn';

/**
 * Erzeugt Team-Spalten mit Action Callbacks
 * @param onEdit - Callback für Bearbeiten-Button
 * @param onDelete - Callback für Löschen-Button
 */
export const createTeamColumns = (
  onEdit?: (member: TeamMember) => void,
  onDelete?: (member: TeamMember) => void,
): Array<ColumnDef<TeamMember>> => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;
      return (
        <div className="font-medium">
          {firstName} {lastName}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const fullName = `${row.original.firstName} ${row.original.lastName}`.toLowerCase();
      return fullName.includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        E-Mail
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: 'Rolle',
    cell: ({ row }) => <div>{row.getValue('role')}</div>,
  },
  {
    accessorKey: 'department',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Abteilung
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('department')}</div>,
  },
  {
    accessorKey: 'phone',
    header: 'Telefon',
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | undefined;
      return <div>{phone || '-'}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as TeamMember['status'];
      const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        vacation: 'bg-blue-100 text-blue-800',
      };
      const statusLabels = {
        active: 'Aktiv',
        inactive: 'Inaktiv',
        vacation: 'Urlaub',
      };
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Aktionen',
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation(); // Verhindert onRowClick
                onEdit(member);
              }}
              title="Bearbeiten"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation(); // Verhindert onRowClick
                onDelete(member);
              }}
              title="Löschen"
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];

// Export für Kompatibilität mit existierendem Code
export const teamColumns = createTeamColumns();
