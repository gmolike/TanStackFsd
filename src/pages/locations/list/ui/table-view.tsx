// src/pages/locations/list/ui/table-view.tsx
import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import type { Location } from '~/entities/location';
import {
  locationColumnSets,
  locationTableDefinition,
  useDeleteLocation,
} from '~/entities/location';

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

interface LocationTableViewProps {
  locations: Array<Location>;
}

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

  const handleAddClick = () => {
    navigate({ to: '/locations/new' });
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      deleteMutation.mutate(locationToDelete.id);
    }
  };

  return (
    <>
      <DataTable
        // Table Definition
        tableDefinition={locationTableDefinition}
        // Type-safe column selection
        selectableColumns={locationColumnSets.full}
        data={locations}
        // ID handling - KEINE selectedId, da wir auf der List-Route sind
        idKey="id"
        // Callbacks
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAddClick}
        // UI Options
        searchPlaceholder="Nach Namen, Code oder Stadt suchen..."
        addButtonText="Neuer Standort"
        showColumnToggle={true}
        showColumnToggleText={false}
        pageSize={10}
        // Sticky Features
        stickyActionColumn={true}
        stickyHeader={true}
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
