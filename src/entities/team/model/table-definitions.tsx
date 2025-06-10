// src/entities/team/model/table-definitions.tsx

import { teamTableLabels } from './labels';
import type { TeamMember } from './schema';

/**
 * Team Table Definitions
 * @description Kombiniert Column Metadata und Table Config in einer Datei
 */

// ===== COLUMN METADATA (Reine Daten-Konfiguration) =====

export type ColumnMetadata = {
  id: string;
  label: string;
  accessor?: keyof TeamMember | ((row: TeamMember) => unknown);
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

// ===== HELPER FUNCTIONS =====

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
      if (typeof col.accessor === 'function') {
        return col.id;
      }
      return col.accessor ?? col.id;
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

// ===== COLUMN VISIBILITY CONFIGS =====

export const defaultColumnVisibility = {
  name: true,
  email: true,
  role: true,
  department: true,
  phone: false,
  status: true,
  actions: true,
};

export const dashboardColumnVisibility = {
  name: true,
  department: true,
  contact: true,
  status: true,
  remoteWork: true,
};

// ===== TABLE COLUMN DEFINITIONS (Mit UI-Komponenten) =====

/**
 * Team Table Column Definitions
 * @description Erstellt die vollständigen Spalten-Definitionen mit UI-Komponenten
 * WICHTIG: Diese Funktionen müssen in einer separaten Datei sein,
 * die die UI-Komponenten importiert, um zirkuläre Abhängigkeiten zu vermeiden.
 * Verwenden Sie stattdessen die Exports aus table-components.tsx
 */

// Diese Funktionen werden in table-components.tsx definiert und von dort exportiert
