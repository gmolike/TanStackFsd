// src/features/team/search-dialog/model/types.ts
import type { TeamMember } from '~/entities/team';

/**
 * Props für den Team Search Dialog
 */
export type TeamSearchDialogProps = {
  /** Ob der Dialog geöffnet ist */
  open: boolean;
  /** Callback zum Ändern des Open-States */
  onOpenChange: (open: boolean) => void;
  /** Callback wenn ein Mitglied ausgewählt wurde */
  onSelect: (member: TeamMember) => void;
  /** Dialog Titel */
  title?: string;
  /** Dialog Beschreibung */
  description?: string;
  /** Ausschließen bestimmter IDs */
  excludeIds?: Array<string>;
};

/**
 * Interner State des Search Dialogs
 */
export type SearchDialogState = {
  /** Aktuell ausgewähltes Mitglied */
  selectedMember: TeamMember | null;
  /** Ob Details angezeigt werden sollen */
  showDetails: boolean;
};

/**
 * Props für die Dialog Content Komponente
 */
export type DialogContentProps = {
  selectedMember: TeamMember | null;
  onMemberSelect: (member: TeamMember) => void;
  excludeIds?: Array<string>;
};

/**
 * Props für die Member Details Komponente
 */
export type MemberDetailsProps = {
  member: TeamMember | null;
};

/**
 * Props für die Search Table Komponente
 */
export type SearchTableProps = {
  onMemberSelect: (member: TeamMember) => void;
  selectedMemberId: string | null;
  excludeIds?: Array<string>;
};
