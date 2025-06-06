// src/pages/team/list/ui/table-view.tsx
import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import type { TeamMember } from '~/entities/team';
import { useDeleteTeamMember } from '~/entities/team';

import { toast } from '~/shared/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/shared/shadcn';
import { DataTable } from '~/shared/ui/data-table';
import { createTeamColumns } from '~/shared/ui/data-table/columns/team-columns';

interface TeamTableViewProps {
  teamMembers: Array<TeamMember>;
}

const teamColumnLabels: Record<string, string> = {
  name: 'Name',
  email: 'E-Mail',
  role: 'Rolle',
  department: 'Abteilung',
  phone: 'Telefon',
  status: 'Status',
  birthDate: 'Geburtsdatum',
  startDate: 'Eintrittsdatum',
};

export function TeamTableView({ teamMembers }: TeamTableViewProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  const deleteMutation = useDeleteTeamMember({
    onSuccess: () => {
      toast({
        title: 'Teammitglied gelöscht',
        description: 'Das Teammitglied wurde erfolgreich entfernt.',
      });
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Löschen',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleRowClick = (member: TeamMember) => {
    navigate({ to: '/team/$memberId', params: { memberId: member.id } });
  };

  const handleEdit = (member: TeamMember) => {
    navigate({ to: '/team/$memberId/edit', params: { memberId: member.id } });
  };

  const handleDelete = (member: TeamMember) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      deleteMutation.mutate(memberToDelete.id);
    }
  };

  const columns = createTeamColumns(handleEdit, handleDelete);

  return (
    <>
      <DataTable
        columns={columns}
        data={teamMembers}
        searchPlaceholder="Globale Suche nach Namen, E-Mail oder Rolle..."
        onRowClick={handleRowClick}
        defaultSorting={[{ id: 'name', desc: false }]}
        defaultColumnVisibility={{
          name: true,
          email: true,
          role: true,
          department: true,
          phone: false,
          status: true,
          actions: true,
        }}
        columnLabels={teamColumnLabels}
        pageSize={10}
        showColumnToggle={true}
        showColumnToggleText={false}
        onAddClick={() => navigate({ to: '/team/new' })}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Teammitglied löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Das Teammitglied{' '}
              {memberToDelete?.firstName} {memberToDelete?.lastName} wird dauerhaft gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
