import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { AlertCircle, Loader2 } from 'lucide-react';

import { TeamDeleteDialog, TeamStatusDropdown } from '~/features/team';

import { TeamMemberInfo, useTeamMember } from '~/entities/team';

import { toast } from '~/shared/hooks/use-toast';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/shared/shadcn';

import { AddressCard } from './ui/AddressCard';
import { InfoCards } from './ui/InfoCard';

type TeamDetailWidgetProps = {
  memberId: string;
};

export const Detail = ({ memberId }: TeamDetailWidgetProps) => {
  const navigate = useNavigate();
  const { data: member, isLoading, error, refetch } = useTeamMember(memberId);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleBack = () => {
    navigate({ to: '/team' });
  };

  const handleEdit = () => {
    navigate({ to: '/team/$memberId/edit', params: { memberId } });
  };

  const handleDeleteSuccess = () => {
    toast({
      title: 'Teammitglied gelöscht',
      description: 'Das Teammitglied wurde erfolgreich entfernt.',
    });
    navigate({ to: '/team' });
  };

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
            <Button onClick={handleBack}>Zurück zur Übersicht</Button>
            <Button variant="outline" onClick={() => refetch()}>
              Erneut versuchen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack}>
          ← Zurück zur Übersicht
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            Bearbeiten
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
            Löschen
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {member.firstName} {member.lastName}
                </CardTitle>
                <TeamStatusDropdown member={member} onSuccess={() => refetch()} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <TeamMemberInfo member={member} />
              {member.bio && (
                <div className="border-t pt-4">
                  <h3 className="mb-2 font-medium">Über mich</h3>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {member.address && <AddressCard address={member.address} />}
        </div>

        <div className="space-y-6">
          <InfoCards member={member} />
        </div>
      </div>

      <TeamDeleteDialog
        member={member}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};
