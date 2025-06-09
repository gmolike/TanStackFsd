// src/pages/home/ui/page.tsx
import { useState } from 'react';

import { TeamSection } from '~/widgets/dashboard';

import { TeamSearchDialog } from '~/features/team/search-dialog';

import type { TeamMember } from '~/entities/team';

import { Button, Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';

export function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [excludeCurrentMember, setExcludeCurrentMember] = useState(false);

  const handleSelect = (member: TeamMember) => {
    console.log('Selected team member:', member);
    setSelectedMember(member);
  };
  return (
    <div className="container mx-auto">
      <h1 className="mb-8 text-4xl font-bold">Dashboard</h1>
      <TeamSection />
      <div className="container mx-auto py-8">
        <h1 className="mb-8 text-3xl font-bold">Team Search Dialog Demo</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dialog öffnen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setIsOpen(true)} className="w-full">
                Teammitglied auswählen
              </Button>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="exclude"
                  checked={excludeCurrentMember}
                  onChange={(e) => setExcludeCurrentMember(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="exclude" className="text-sm">
                  Aktuell ausgewähltes Mitglied ausschließen
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ausgewähltes Mitglied</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMember ? (
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedMember.firstName} {selectedMember.lastName}
                  </p>
                  <p>
                    <strong>E-Mail:</strong> {selectedMember.email}
                  </p>
                  <p>
                    <strong>Position:</strong> {selectedMember.role}
                  </p>
                  <p>
                    <strong>Abteilung:</strong> {selectedMember.department}
                  </p>
                  <p>
                    <strong>ID:</strong> <code className="text-xs">{selectedMember.id}</code>
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">Noch kein Mitglied ausgewählt</p>
              )}
            </CardContent>
          </Card>
        </div>

        <TeamSearchDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          onSelect={handleSelect}
          excludeIds={excludeCurrentMember && selectedMember ? [selectedMember.id] : undefined}
        />
      </div>
    </div>
  );
}
