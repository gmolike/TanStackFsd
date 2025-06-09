// src/pages/locations/detail/ui/inventory-tab.tsx
import { useState } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Package, Plus, Trash2 } from 'lucide-react';

import type { Location, LocationInventory } from '~/entities/location';
import { useLocationInventory, useRemoveArticleFromLocation } from '~/entities/location';

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
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/shared/shadcn';
import { DataTable } from '~/shared/ui/data-table';

import type { Article } from '../../../../entities/article';

interface InventoryTabProps {
  locationId: string;
  locationType: Location['type'];
}

type InventoryItem = LocationInventory & { article?: Article };

export function InventoryTab({ locationId, locationType }: InventoryTabProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // API Hooks
  const { data, isLoading, refetch } = useLocationInventory(locationId);
  const removeMutation = useRemoveArticleFromLocation({
    onSuccess: () => {
      toast({
        title: 'Artikel entfernt',
        description: 'Der Artikel wurde aus dem Lagerbestand entfernt.',
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Entfernen',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const inventory = data?.data || [];

  // Columns Definition
  const columns: Array<ColumnDef<InventoryItem>> = [
    {
      accessorKey: 'article.articleNumber',
      header: 'Art.-Nr.',
      cell: ({ row }) => (
        <div className="font-mono text-xs">{row.original.article?.articleNumber || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'article.name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Artikel
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.article?.name || 'Unbekannter Artikel'}</div>
          {row.original.article?.description && (
            <div className="line-clamp-1 text-sm text-muted-foreground">
              {row.original.article.description}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'storageLocation',
      header: 'Lagerplatz',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue('storageLocation') || '-'}</div>
      ),
    },
    {
      accessorKey: 'stock',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Bestand
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.getValue('stock');
        const minStock = row.original.minStock;
        const isLow = stock <= minStock;

        return (
          <div className={isLow ? 'font-medium text-orange-600' : ''}>
            {stock} {row.original.article?.unit || 'Stück'}
            {isLow && <span className="text-xs"> ⚠️</span>}
          </div>
        );
      },
    },
    {
      accessorKey: 'reservedStock',
      header: 'Reserviert',
      cell: ({ row }) => {
        const reserved = row.getValue('reservedStock');
        if (reserved === 0) return <span className="text-muted-foreground">-</span>;
        return <div>{reserved}</div>;
      },
    },
    {
      accessorKey: 'minStock',
      header: 'Min',
      cell: ({ row }) => <div>{row.getValue('minStock')}</div>,
    },
    {
      accessorKey: 'maxStock',
      header: 'Max',
      cell: ({ row }) => {
        const maxStock = row.getValue('maxStock');
        return <div>{maxStock || '-'}</div>;
      },
    },
    {
      accessorKey: 'article.price',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Wert
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = row.original.article?.price || 0;
        const stock = row.original.stock;
        const totalValue = price * stock;

        return (
          <div className="text-right">
            <div className="font-medium">
              {new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
              }).format(totalValue)}
            </div>
            <div className="text-xs text-muted-foreground">@ {price.toFixed(2)} €</div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setItemToDelete(item);
              setDeleteDialogOpen(true);
            }}
            title="Aus Lager entfernen"
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  // Empty State für Office
  if (locationType === 'office') {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Kein Lagerbestand für Büros</p>
          <p className="mt-2 text-muted-foreground">
            Bürostandorte haben keinen Lagerbestand für Artikel.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Empty State
  if (!isLoading && inventory.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Kein Lagerbestand vorhanden</p>
          <p className="mt-2 text-muted-foreground">
            Fügen Sie Artikel zum Lager hinzu, um den Bestand zu verwalten.
          </p>
          <Button className="mt-4" onClick={() => {}}>
            <Plus className="mr-2 h-4 w-4" />
            Artikel hinzufügen
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lagerbestand</CardTitle>
              <CardDescription>
                Verwalten Sie die Artikel und Bestände an diesem Standort
              </CardDescription>
            </div>
            <Button onClick={() => {}}>
              <Plus className="mr-2 h-4 w-4" />
              Artikel hinzufügen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={inventory}
            // searchKey entfernt - nutzt global filter
            searchPlaceholder="Nach Artikelname suchen..."
            pageSize={20}
            showColumnToggle={true}
            columnLabels={{
              'article.articleNumber': 'Artikelnummer',
              'article.name': 'Artikel',
              storageLocation: 'Lagerplatz',
              stock: 'Bestand',
              reservedStock: 'Reserviert',
              minStock: 'Mindestbestand',
              maxStock: 'Maximalbestand',
              'article.price': 'Wert',
            }}
            // Loading state aktivieren
            withSkeleton={true}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Lösch-Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Artikel aus Lager entfernen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie den Artikel <strong>{itemToDelete?.article?.name || 'Unbekannt'}</strong>
              wirklich aus diesem Lager entfernen? Der aktuelle Bestand von{' '}
              <strong>{itemToDelete?.stock} Einheiten</strong> geht dabei verloren.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToDelete) {
                  removeMutation.mutate(itemToDelete.id);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Entfernen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
