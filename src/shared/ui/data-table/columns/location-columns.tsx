// src/shared/ui/data-table/columns/location-columns.tsx
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, MoreHorizontal, Trash2 } from 'lucide-react';

import type { Location } from '~/entities/location';
import { locationStatusOptions, locationTypeOptions } from '~/entities/location';

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
 * Erzeugt Location-Spalten mit Action Callbacks
 * @param onEdit - Callback für Bearbeiten-Button
 * @param onDelete - Callback für Löschen-Button
 */
export const createLocationColumns = (
  onEdit?: (location: Location) => void,
  onDelete?: (location: Location) => void,
): Array<ColumnDef<Location>> => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue('code')}</div>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Typ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.getValue('type');
      const typeOption = locationTypeOptions[type];
      return (
        <div className="flex items-center gap-2">
          <span>{typeOption.icon}</span>
          <span>{typeOption.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'address',
    header: 'Adresse',
    cell: ({ row }) => {
      const address = row.original.address;
      return (
        <div>
          <div className="font-medium">{address.city}</div>
          <div className="text-sm text-muted-foreground">{address.street}</div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const address = row.original.address;
      const searchValue = value.toLowerCase();
      return (
        address.city.toLowerCase().includes(searchValue) ||
        address.street.toLowerCase().includes(searchValue) ||
        (address.postalCode?.toLowerCase().includes(searchValue) ?? false)
      );
    },
  },
  {
    accessorKey: 'capacity',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Kapazität
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const capacity = row.original.capacity;
      const unit = row.original.capacityUnit;
      if (!capacity) return <span className="text-muted-foreground">-</span>;
      return (
        <div>
          {capacity.toLocaleString('de-DE')} {unit}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        maintenance: 'bg-yellow-100 text-yellow-800',
      };
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}
        >
          {locationStatusOptions[status].label}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Aktionen',
    enableHiding: false,
    cell: ({ row }) => {
      const location = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(location.code)}>
              Code kopieren
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(location);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Bearbeiten
            </DropdownMenuItem>
            <DropdownMenuItem>Details anzeigen</DropdownMenuItem>
            <DropdownMenuItem>Inventar verwalten</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(location);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Löschen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Export für Kompatibilität mit existierendem Code
export const locationColumns = createLocationColumns();
