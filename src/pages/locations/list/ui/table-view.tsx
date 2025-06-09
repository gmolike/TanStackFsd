// src/pages/locations/list/ui/table-view.tsx
import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import type { Location } from '~/entities/location';
import { useDeleteLocation } from '~/entities/location';

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

import { createLocationColumns } from '../../../../entities/location/model/location-columns';

interface LocationTableViewProps {
  locations: Array<Location>;
}

// Column Labels für generische Anzeige
const locationColumnLabels: Record<string, string> = {
  code: 'Code',
  name: 'Name',
  type: 'Typ',
  status: 'Status',
  address: 'Adresse',
  manager: 'Verantwortlicher',
  capacity: 'Kapazität',
};

export function LocationTableView({ locations }: LocationTableViewProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

  // Delete mutation
  const deleteMutation = useDeleteLocation({
    onSuccess: () => {
      toast({
        title: 'Standort gelöscht',
        description: 'Der Standort wurde erfolgreich entfernt.',
      });
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Löschen',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleRowClick = (location: Location) => {
    navigate({ to: '/locations/$locationId', params: { locationId: location.id } });
  };

  const handleEdit = (location: Location) => {
    navigate({ to: '/locations/$locationId/edit', params: { locationId: location.id } });
  };

  const handleDelete = (location: Location) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      deleteMutation.mutate(locationToDelete.id);
    }
  };

  // Erstelle Spalten mit Action Callbacks
  const columns = createLocationColumns(handleEdit, handleDelete);

  return (
    <>
      <DataTable
        columns={columns}
        data={locations}
        searchPlaceholder="Nach Namen suchen..."
        onRowClick={handleRowClick}
        // searchKey entfernt - nutzt jetzt global filter

        // Standard-Sortierung nach Name (aufsteigend)
        defaultSorting={[{ id: 'name', desc: false }]}
        // Standard-Spalten-Sichtbarkeit
        defaultColumnVisibility={{
          code: true,
          name: true,
          type: true,
          status: true,
          address: true,
          manager: false, // Manager standardmäßig ausgeblendet
          capacity: false, // Kapazität standardmäßig ausgeblendet
          actions: true,
        }}
        // Column Labels für Dropdown
        columnLabels={locationColumnLabels}
        // Weitere Optionen
        pageSize={10}
        showColumnToggle={true}
        // Neue Features können optional hinzugefügt werden
        withSkeleton={false} // Falls Loading State benötigt
        enableGlobalFilter={true}
        enableRowSelection={false}
      />

      {/* Lösch-Bestätigungsdialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Standort löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Der Standort{' '}
              <strong>{locationToDelete?.name}</strong> ({locationToDelete?.code}) wird dauerhaft
              gelöscht.
              {locationToDelete &&
                (locationToDelete.type === 'warehouse' || locationToDelete.type === 'store') && (
                  <span className="mt-2 block text-orange-600">
                    Achtung: Stellen Sie sicher, dass alle Artikel aus diesem Lager entfernt wurden.
                  </span>
                )}
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
