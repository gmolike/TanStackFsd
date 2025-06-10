// src/entities/team/ui/table-components.tsx
import type { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '~/shared/shadcn';
import {
  StandardContactCell,
  StandardEmailCell,
  StandardPhoneCell,
  TableDeleteButton,
  TableEditButton,
} from '~/shared/ui/data-table';

import { teamTableLabels } from '../model/labels';
import type { TeamMember } from '../model/schema';
import { dashboardColumnVisibility, defaultColumnVisibility } from '../model/table-definitions';

import { StatusBadge } from './status-badge';

/**
 * Team Table Components
 * @description Alle Table-bezogenen UI-Komponenten an einem Ort
 */

// ===== TABLE HEADER COMPONENTS =====

/**
 * CSDoc: Sortable Header Component
 * @description Header mit Sortier-Funktionalität
 */
export const SortableHeader = ({
  column,
  label,
}: {
  column: Column<TeamMember, unknown>;
  label: string;
}) => (
  <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    {label}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

/**
 * CSDoc: Simple Header Component
 * @description Einfacher Header ohne Funktionalität
 */
export const SimpleHeader = ({ label }: { label: string }) => <span>{label}</span>;

// ===== TABLE CELL COMPONENTS =====

/**
 * Name Cell Component
 * @description Zeigt den vollen Namen eines Teammitglieds
 */
export const NameCell = ({ member }: { member: TeamMember }) => (
  <div className="font-medium">
    {member.firstName} {member.lastName}
  </div>
);

/**
 * Email Cell Component
 * @description Nutzt Standard Email Cell für einheitliche Darstellung
 */
export const EmailCell = ({ email }: { email: string }) => (
  <StandardEmailCell email={email} variant="default" />
);

/**
 * Role Cell Component
 * @description Zeigt die Rolle des Teammitglieds
 */
export const RoleCell = ({ role }: { role: string }) => <div>{role}</div>;

/**
 * Department Cell Component
 * @description Zeigt die Abteilung des Teammitglieds
 */
export const DepartmentCell = ({ department }: { department: string }) => <div>{department}</div>;

/**
 * Phone Cell Component
 * @description Nutzt Standard Phone Cell für einheitliche Darstellung
 */
export const PhoneCell = ({ phone }: { phone?: string }) => (
  <StandardPhoneCell phone={phone} variant="default" />
);

/**
 * Status Cell Component
 * @description Zeigt den Status als Badge
 */
export const StatusCell = ({ status }: { status: TeamMember['status'] }) => (
  <StatusBadge status={status} />
);

/**
 * Actions Cell Component
 * @description Zeigt Standard-Aktions-Buttons für Bearbeiten und Löschen
 */
export const ActionsCell = ({
  member,
  onEdit,
  onDelete,
}: {
  member: TeamMember;
  onEdit?: (editMember: TeamMember) => void;
  onDelete?: (deleteMember: TeamMember) => void;
}) => (
  <div className="flex items-center gap-2">
    {onEdit && <TableEditButton onClick={() => onEdit(member)} />}
    {onDelete && <TableDeleteButton onClick={() => onDelete(member)} />}
  </div>
);

/**
 * Dashboard Name Cell Component
 * @description Zeigt Name und Rolle für Dashboard-Ansicht
 */
export const DashboardNameCell = ({ member }: { member: TeamMember }) => (
  <div>
    <div className="font-medium">
      {member.firstName} {member.lastName}
    </div>
    <div className="text-sm text-muted-foreground">{member.role}</div>
  </div>
);

/**
 * Dashboard Contact Cell Component
 * @description Nutzt Standard Contact Cell für einheitliche Darstellung
 */
export const DashboardContactCell = ({ member }: { member: TeamMember }) => (
  <StandardContactCell email={member.email} phone={member.phone} variant="icon" />
);

/**
 * Remote Work Cell Component
 * @description Zeigt Remote-Work-Status als Checkmark
 */
export const RemoteWorkCell = ({ remoteWork }: { remoteWork: boolean }) => (
  <span className="text-sm">{remoteWork ? '✓' : '-'}</span>
);

// ===== COLUMN CREATION FUNCTIONS =====

/**
 * Team Table Column Definitions
 * @description Erstellt die vollständigen Spalten-Definitionen mit UI-Komponenten
 */
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
  ...(onEdit || onDelete
    ? [
        {
          id: 'actions',
          header: () => <SimpleHeader label={teamTableLabels.actions} />,
          cell: ({ row }) => (
            <ActionsCell member={row.original} onEdit={onEdit} onDelete={onDelete} />
          ),
          enableHiding: false,
          enableGlobalFilter: false,
        } as ColumnDef<TeamMember>,
      ]
    : []),
];

/**
 * Dashboard Column Definitions
 */
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

/**
 * Team Table Columns
 * @description Exportiert die konfigurierten Tabellen-Spalten für Team-Listen
 */

// Standard Team Columns
export const createTeamColumns = (
  onEdit?: (member: TeamMember) => void,
  onDelete?: (member: TeamMember) => void,
) => createTeamColumnDefs(onEdit, onDelete);

// Dashboard Columns
export const createDashboardColumns = () => createDashboardColumnDefs();

// Export visibility configs
export { dashboardColumnVisibility, defaultColumnVisibility };

// Legacy export für Rückwärtskompatibilität
export const teamColumns = createTeamColumns();
