// src/entities/location/model/table-definition.tsx
import type { ExtractFieldIds, FieldDefinition, TableDefinition } from '~/shared/ui/data-table';

import { locationLabels } from './labels';
import type { Location } from './schema';

// Location Type Cell
const LocationTypeCell = ({ value }: { value: unknown; row: Location }) => {
  const type = value as Location['type'];
  return (
    <div className="flex items-center gap-2">
      <span>{type}</span>
    </div>
  );
};

// Location Status Cell
const LocationStatusCell = ({ value }: { value: unknown; row: Location }) => {
  const status = value as Location['status'];
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

// Address Cell
const LocationAddressCell = ({ row }: { value: unknown; row: Location }) => (
  <div>
    <div className="font-medium">{row.address.city}</div>
    <div className="text-sm text-muted-foreground">{row.address.street}</div>
  </div>
);

// Capacity Cell
const LocationCapacityCell = ({ row }: { value: unknown; row: Location }) => {
  if (!row.capacity) return <span className="text-muted-foreground">-</span>;
  return (
    <div>
      {row.capacity.toLocaleString('de-DE')} {row.capacityUnit}
    </div>
  );
};

/**
 * Location Table Field Definitions
 */
const locationFields: Array<FieldDefinition<Location>> = [
  {
    id: 'code',
    accessor: (row: Location) => row.code,
    sortable: true,
    searchable: true,
    cell: 'default',
  },
  {
    id: 'name',
    accessor: (row: Location) => row.name,
    sortable: true,
    searchable: true,
    cell: 'default',
  },
  {
    id: 'type',
    accessor: (row: Location) => row.type,
    sortable: true,
    searchable: true,
    filterable: true,
    cell: LocationTypeCell,
  },
  {
    id: 'status',
    accessor: (row: Location) => row.status,
    sortable: false,
    searchable: false,
    filterable: true,
    cell: LocationStatusCell,
  },
  {
    id: 'address',
    accessor: (row: Location) => row.address,
    sortable: false,
    searchable: true,
    cell: LocationAddressCell,
  },
  {
    id: 'capacity',
    accessor: (row: Location) => row.capacity,
    sortable: true,
    searchable: false,
    cell: LocationCapacityCell,
  },
  {
    id: 'actions',
    sortable: false,
    searchable: false,
    cell: 'actions',
  },
];

/**
 * Location Table Definition
 */
export const locationTableDefinition: TableDefinition<Location> = {
  labels: locationLabels,
  fields: locationFields,
};

// Type für die verfügbaren Spalten-IDs
type LocationColumnId = ExtractFieldIds<typeof locationTableDefinition>;

/**
 * Vordefinierte Spalten-Sets für verschiedene Ansichten
 */
export const locationColumnSets = {
  // Vollständige Tabelle
  full: [
    'code',
    'name',
    'type',
    'status',
    'address',
    'capacity',
    'actions',
  ] as Array<LocationColumnId>,

  // Kompakte Ansicht
  compact: ['code', 'name', 'type', 'status'] as Array<LocationColumnId>,

  // Dashboard Ansicht
  dashboard: ['name', 'type', 'status', 'capacity'] as Array<LocationColumnId>,

  // Ohne Actions
  readOnly: ['code', 'name', 'type', 'status', 'address', 'capacity'] as Array<LocationColumnId>,
};
