// src/features/team/search-dialog/searchDialog.tsx
import { useCallback, useEffect } from 'react';

import {
  Button,
  Dialog,
  DialogContent as ShadcnDialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/shared/shadcn';

import { useSearchDialogState } from './model/hooks';
import type { TeamSearchDialogProps } from './model/types';
import { DialogContent } from './ui/DialogContent';

/**
 * Team Search Dialog - Ein zweispaltiger Dialog zur Auswahl von Teammitgliedern
 *
 * @component
 * @param props - Dialog Konfiguration
 *
 * @example
 * ```tsx
 * <TeamSearchDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   onSelect={(member) => {
 *     console.log('Selected:', member);
 *   }}
 * />
 * ```
 */
export const TeamSearchDialog = ({
  open,
  onOpenChange,
  onSelect,
  title = 'Teammitglied auswählen',
  description = 'Suchen und wählen Sie ein Teammitglied aus der Liste',
  excludeIds,
}: TeamSearchDialogProps) => {
  const { state, actions } = useSearchDialogState();

  // Reset state wenn Dialog geschlossen wird
  useEffect(() => {
    if (!open) {
      // Verzögertes Reset für sanfte Animation
      const timer = setTimeout(() => {
        actions.reset();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open, actions]);

  // Handler für Mitglieder-Auswahl
  const handleMemberSelect = useCallback(
    (member: any) => {
      actions.selectMember(member);
    },
    [actions],
  );

  // Handler für Bestätigung
  const handleConfirm = useCallback(() => {
    if (state.selectedMember) {
      console.log('Selected team member:', state.selectedMember);
      onSelect(state.selectedMember);
      onOpenChange(false);
    }
  }, [state.selectedMember, onSelect, onOpenChange]);

  // Handler für Abbrechen
  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ShadcnDialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogContent
          selectedMember={state.selectedMember}
          onMemberSelect={handleMemberSelect}
          excludeIds={excludeIds}
        />

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Abbrechen
          </Button>
          <Button onClick={handleConfirm} disabled={!state.selectedMember}>
            {state.selectedMember
              ? `${state.selectedMember.firstName} ${state.selectedMember.lastName} auswählen`
              : 'Person auswählen'}
          </Button>
        </DialogFooter>
      </ShadcnDialogContent>
    </Dialog>
  );
};
