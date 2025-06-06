// src/pages/locations/detail/ui/page.tsx
import { useState } from 'react';

import { useNavigate, useParams } from '@tanstack/react-router';
import { AlertCircle, Building2, Loader2, MapPin, Package, Users } from 'lucide-react';

import { useDeleteLocation, useLocation, useLocationStats } from '~/entities/location';

import { toast } from '~/shared/hooks/use-toast';
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/shared/shadcn';

import { InventoryTab } from './inventory-tab';
import { OverviewTab } from './overview-tab';
import { TeamTab } from './team-tab';

export function LocationsDetailPage() {
  const navigate = useNavigate();
  const { locationId } = useParams({ from: '/locations/$locationId' });
  const [activeTab, setActiveTab] = useState('overview');

  // API Hooks
  const { data: location, isLoading, error, refetch } = useLocation(locationId);
  const { data: stats } = useLocationStats(locationId);

  const deleteMutation = useDeleteLocation({
    onSuccess: () => {
      toast({
        title: 'Standort gelöscht',
        description: 'Der Standort wurde erfolgreich entfernt.',
      });
      navigate({ to: '/locations' });
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Löschen',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Lade Standort...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (error || !location) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error?.message || 'Standort nicht gefunden'}</AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button onClick={() => navigate({ to: '/locations' })}>Zurück zur Übersicht</Button>
            <Button variant="outline" onClick={() => refetch()}>
              Erneut versuchen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
  };

  const statusLabels = {
    active: 'Aktiv',
    inactive: 'Inaktiv',
    maintenance: 'Wartung',
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate({ to: '/locations' })}>
            ← Zurück
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{location.name}</h1>
            <p className="mt-1 text-muted-foreground">Code: {location.code}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[location.status]}`}
          >
            {statusLabels[location.status]}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/locations/$locationId/edit', params: { locationId } })}
          >
            Bearbeiten
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Löschen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Standort löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Diese Aktion kann nicht rückgängig gemacht werden. Der Standort{' '}
                  <strong>{location.name}</strong> wird dauerhaft gelöscht.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate(locationId)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Löschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Statistik-Karten */}
      {stats && (
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Artikel</p>
                  <p className="text-2xl font-bold">{stats.totalArticles}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bestand</p>
                  <p className="text-2xl font-bold">{stats.totalStock.toLocaleString('de-DE')}</p>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Warenwert</p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 0,
                    }).format(stats.totalValue)}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mitarbeiter</p>
                  <p className="text-2xl font-bold">{stats.teamMemberCount}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              {stats.lowStockCount > 0 && (
                <p className="mt-2 text-xs text-orange-600">
                  {stats.lowStockCount} Artikel unter Mindestbestand
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="inventory">
            Lagerbestand
            {location.type !== 'office' && stats && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {stats.totalArticles}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="team">
            Team
            {stats && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {stats.teamMemberCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab location={location} />
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <InventoryTab locationId={locationId} locationType={location.type} />
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <TeamTab locationId={locationId} managerId={location.managerId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
