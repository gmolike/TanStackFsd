// src/pages/team/detail/ui/page.tsx
import { useNavigate, useParams } from '@tanstack/react-router';
import { AlertCircle, Calendar, Loader2, Mail, MapPin, Phone, User } from 'lucide-react';

import { useDeleteTeamMember, useTeamMember, useUpdateTeamMemberStatus } from '~/entities/team';

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/shared/shadcn';

export function TeamDetailPage() {
  const navigate = useNavigate();
  const { memberId } = useParams({ from: '/team/$memberId' });

  // API Hooks
  const { data: member, isLoading, error, refetch } = useTeamMember(memberId);
  const deleteMutation = useDeleteTeamMember({
    onSuccess: () => {
      toast({
        title: 'Teammitglied gelöscht',
        description: 'Das Teammitglied wurde erfolgreich entfernt.',
      });
      navigate({ to: '/team' });
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Löschen',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateStatusMutation = useUpdateTeamMemberStatus({
    onSuccess: () => {
      toast({
        title: 'Status aktualisiert',
        description: 'Der Status wurde erfolgreich geändert.',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Aktualisieren',
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
            <p className="text-lg text-muted-foreground">Lade Teammitglied...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (error || !member) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error?.message || 'Teammitglied nicht gefunden'}</AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button onClick={() => navigate({ to: '/team' })}>Zurück zur Übersicht</Button>
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
    vacation: 'bg-blue-100 text-blue-800',
  };

  const statusLabels = {
    active: 'Aktiv',
    inactive: 'Inaktiv',
    vacation: 'Urlaub',
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/team' })}>
          ← Zurück zur Übersicht
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/team/$memberId/edit', params: { memberId } })}
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
                <AlertDialogTitle>Teammitglied löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Diese Aktion kann nicht rückgängig gemacht werden. Das Teammitglied{' '}
                  {member.firstName} {member.lastName} wird dauerhaft gelöscht.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate(memberId)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Löschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hauptinformationen */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {member.firstName} {member.lastName}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${statusColors[member.status]}`}
                    >
                      {statusLabels[member.status]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateStatusMutation.mutate({ id: memberId, status: 'active' })
                      }
                      disabled={member.status === 'active'}
                    >
                      Aktiv
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateStatusMutation.mutate({ id: memberId, status: 'inactive' })
                      }
                      disabled={member.status === 'inactive'}
                    >
                      Inaktiv
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateStatusMutation.mutate({ id: memberId, status: 'vacation' })
                      }
                      disabled={member.status === 'vacation'}
                    >
                      Urlaub
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rolle</p>
                    <p className="font-medium">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">E-Mail</p>
                    <a
                      href={`mailto:${member.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <a
                        href={`tel:${member.phone}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {member.phone}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Eintrittsdatum</p>
                    <p className="font-medium">
                      {new Date(member.startDate).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {member.bio && (
                <div className="border-t pt-4">
                  <h3 className="mb-2 font-medium">Über mich</h3>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {member.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Adresse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic">
                  <p>{member.address.street}</p>
                  <p>
                    {member.address.postalCode} {member.address.city}
                  </p>
                  <p>{member.address.country}</p>
                </address>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Seitenleiste mit zusätzlichen Infos */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Abteilung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{member.department}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Einstellungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Newsletter</span>
                <span
                  className={`text-sm font-medium ${member.newsletter ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {member.newsletter ? 'Abonniert' : 'Nicht abonniert'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Remote Work</span>
                <span
                  className={`text-sm font-medium ${member.remoteWork ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {member.remoteWork ? 'Erlaubt' : 'Nicht erlaubt'}
                </span>
              </div>
            </CardContent>
          </Card>

          {member.birthDate && (
            <Card>
              <CardHeader>
                <CardTitle>Geburtstag</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">
                  {new Date(member.birthDate).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
