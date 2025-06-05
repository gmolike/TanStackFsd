// src/shared/ui/data-table/columns/team-columns.tsx
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import type { TeamMember } from '~/entities/team';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/shared/shadcn';

/**
 * Spalten-Definition für die Team-Tabelle
 */
export const teamColumns: Array<ColumnDef<TeamMember>> = [
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
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menü öffnen</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(member.email)}>
              E-Mail kopieren
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Details anzeigen</DropdownMenuItem>
            <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Löschen</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
