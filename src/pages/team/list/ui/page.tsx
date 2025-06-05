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
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // API Hook verwenden
  const { data, isLoading, error, refetch } = useTeamMembers({
    page,
    limit: 10,
    search: searchTerm,
    searchFields: ['firstName', 'lastName', 'email', 'role', 'department'],
    sort: { field: 'lastName', order: 'asc' },
  });

  const teamMembers = data?.data || [];
  const totalPages = data?.totalPages || 1;

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
  if (!teamMembers.length && !searchTerm) {
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
          <p className="mt-2 text-gray-600">{data?.total || 0} Teammitglieder insgesamt</p>
        </div>

        <div className="flex items-center gap-4">
          <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
          <Button onClick={() => navigate({ to: '/team/new' })}>
            <Plus className="mr-2 h-4 w-4" />
            Neues Mitglied
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Suche nach Name, E-Mail, Rolle oder Abteilung..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset auf erste Seite bei neuer Suche
          }}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Content - Table oder Cards */}
      {viewMode === 'table' ? (
        <TeamTableView teamMembers={teamMembers} />
      ) : (
        <TeamCardView teamMembers={teamMembers} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Seite {page} von {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Zurück
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Weiter
            </Button>
          </div>
        </div>
      )}

      {/* No Results for Search */}
      {!teamMembers.length && searchTerm && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Keine Teammitglieder gefunden für "{searchTerm}"
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
              className="mt-2"
            >
              Suche zurücksetzen
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
