// src/features/team/search-dialog/ui/DialogContent.tsx

import type { DialogContentProps } from '../model/types';

import { MemberDetails } from './MemberDetails';
import { SearchTable } from './SearchTable';

/**
 * Inhalt des Team Search Dialogs mit Split-Layout
 *
 * @component
 * @param props - DialogContent Konfiguration
 */
export const DialogContent = ({
  selectedMember,
  onMemberSelect,
  excludeIds,
}: DialogContentProps) => (
  <div className="grid max-h-[550px] gap-4 overflow-hidden md:grid-cols-2">
    {/* Linke Seite: Such-Tabelle */}
    <div className="flex h-full flex-col overflow-hidden">
      <SearchTable
        onMemberSelect={onMemberSelect}
        selectedMemberId={selectedMember?.id || null}
        excludeIds={excludeIds}
      />
    </div>

    {/* Rechte Seite: Details */}
    <div className="h-full overflow-auto">
      <MemberDetails member={selectedMember} />
    </div>
  </div>
);
