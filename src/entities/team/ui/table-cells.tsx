// src/entities/team/ui/table-cells/index.tsx
import {
  StandardContactCell,
  StandardEmailCell,
  StandardPhoneCell,
  TableDeleteButton,
  TableEditButton,
} from '~/shared/ui/data-table';

import type { TeamMember } from '../model/schema';

import { StatusBadge } from './status-badge';

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
 * Nutzt die einheitlichen Button-Komponenten aus shared/ui/data-table
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
