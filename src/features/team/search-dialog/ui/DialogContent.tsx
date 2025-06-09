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
  <div className="grid h-[550px] gap-4 md:grid-cols-2">
    {/* Linke Seite: Such-Tabelle */}
    <div className="h-full">
      <SearchTable
        onMemberSelect={onMemberSelect}
        selectedMemberId={selectedMember?.id || null}
        excludeIds={excludeIds}
      />
    </div>

    {/* Rechte Seite: Details */}
    <div className="h-full">
      <MemberDetails member={selectedMember} />
    </div>
  </div>
);
