// src/pages/team/list/ui/page.tsx
import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { AlertCircle, Loader2, Plus } from 'lucide-react';

import { useTeamMembers } from '~/entities/team';

import { Alert, AlertDescription, Button, Card, CardContent, CardHeader } from '~/shared/shadcn';
import type { ViewMode } from '~/shared/ui/view-switcher';
import { ViewSwitcher } from '~/shared/ui/view-switcher';

import { TeamCardView } from './card-view';
import { TeamTableView } from './table-view';

export function TeamListPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const navigate = useNavigate();

  // API Hook - Lade ALLE Daten mit explizitem hohen Limit
  const { data, isLoading, error, refetch } = useTeamMembers({
    page: 1,
    limit: 1000, // Hohes Limit um alle zu bekommen
    sort: { field: 'lastName', order: 'asc' },
  });

  const teamMembers = data?.data || [];

  // Debug logging
  console.log('Loaded team members:', teamMembers.length);
  console.log('Total available:', data?.total);

  // ... Rest des Codes bleibt gleich

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Lade Teammitglieder...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Fehler beim Laden der Teammitglieder: {error.message}
              </AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => refetch()}>Erneut versuchen</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty State
  if (!teamMembers.length) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <div className="mb-4 rounded-full bg-muted p-6">
              <Plus className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Keine Teammitglieder</h3>
            <p className="mb-6 text-center text-muted-foreground">
              Fügen Sie Ihr erstes Teammitglied hinzu, um loszulegen.
            </p>
            <Button onClick={() => navigate({ to: '/team/new' })}>
              <Plus className="mr-2 h-4 w-4" />
              Erstes Mitglied hinzufügen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header mit Titel und Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="mt-2 text-gray-600">
            {data?.total || teamMembers.length} Teammitglieder insgesamt
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
        </div>
      </div>

      {/* Content - Table oder Cards */}
      {viewMode === 'table' ? (
        <TeamTableView teamMembers={teamMembers} />
      ) : (
        <TeamCardView teamMembers={teamMembers} />
      )}
    </div>
  );
}
