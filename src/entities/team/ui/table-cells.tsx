import type { TeamMember } from '../model/schema';

import { StatusBadge } from './status-badge';

// Name Cell für Team
export const TeamNameCell = ({ row }: { row: TeamMember }) => (
  <div className="font-medium">
    {row.firstName} {row.lastName}
  </div>
);

// Status Cell Wrapper
export const TeamStatusCell = ({ value }: { value: unknown }) => (
  <StatusBadge status={value as TeamMember['status']} />
);
