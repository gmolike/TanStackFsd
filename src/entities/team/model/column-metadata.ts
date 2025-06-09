// src/entities/team/model/column-metadata.ts
import { teamTableLabels } from './labels';
import type { TeamMember } from './schema';

/**
 * Column Metadata ohne UI-Komponenten
 * @description Reine Datenstruktur für Spalten-Konfiguration
 */

export type ColumnMetadata = {
  id: string;
  label: string;
  accessor?: keyof TeamMember | ((row: TeamMember) => any);
  sortable?: boolean;
  searchable?: boolean;
  defaultVisible?: boolean;
  width?: string;
};

// Team Columns Metadata
export const teamColumnsMetadata: Array<ColumnMetadata> = [
  {
    id: 'name',
    label: teamTableLabels.name,
    accessor: (row) => `${row.firstName} ${row.lastName}`,
    sortable: true,
    searchable: true,
    defaultVisible: true,
  },
  {
    id: 'email',
    label: teamTableLabels.email,
    accessor: 'email',
    sortable: true,
    searchable: true,
    defaultVisible: true,
  },
  {
    id: 'role',
    label: teamTableLabels.role,
    accessor: 'role',
    sortable: false,
    searchable: true,
    defaultVisible: true,
  },
  {
    id: 'department',
    label: teamTableLabels.department,
    accessor: 'department',
    sortable: true,
    searchable: true,
    defaultVisible: true,
  },
  {
    id: 'phone',
    label: teamTableLabels.phone,
    accessor: 'phone',
    sortable: false,
    searchable: false,
    defaultVisible: false,
  },
  {
    id: 'status',
    label: teamTableLabels.status,
    accessor: 'status',
    sortable: false,
    searchable: false,
    defaultVisible: true,
  },
];

// Dashboard Columns Metadata
export const dashboardColumnsMetadata: Array<ColumnMetadata> = [
  {
    id: 'name',
    label: teamTableLabels.name,
    accessor: (row) => `${row.firstName} ${row.lastName}`,
    defaultVisible: true,
  },
  {
    id: 'department',
    label: teamTableLabels.department,
    accessor: 'department',
    defaultVisible: true,
  },
  {
    id: 'contact',
    label: teamTableLabels.contact,
    defaultVisible: true,
  },
  {
    id: 'status',
    label: teamTableLabels.status,
    accessor: 'status',
    defaultVisible: true,
  },
  {
    id: 'remoteWork',
    label: teamTableLabels.remoteWork,
    accessor: 'remoteWork',
    defaultVisible: true,
  },
];

// Helper Functions
export const getColumnMetadata = (
  id: string,
  type: 'team' | 'dashboard' = 'team',
): ColumnMetadata | undefined => {
  const metadata = type === 'team' ? teamColumnsMetadata : dashboardColumnsMetadata;
  return metadata.find((col) => col.id === id);
};

export const getSearchableColumns = (): Array<string> =>
  teamColumnsMetadata
    .filter((col) => col.searchable)
    .map((col) => {
      // Wenn accessor eine Funktion ist, nutze die ID
      if (typeof col.accessor === 'function') {
        return col.id;
      }
      // Sonst nutze den accessor key
      return col.accessor || col.id;
    });

export const getDefaultVisibility = (
  type: 'team' | 'dashboard' = 'team',
): Record<string, boolean> => {
  const metadata = type === 'team' ? teamColumnsMetadata : dashboardColumnsMetadata;
  return metadata.reduce(
    (acc, col) => ({
      ...acc,
      [col.id]: col.defaultVisible ?? true,
    }),
    {} as Record<string, boolean>,
  );
};
