// src/pages/team/detail/ui/page.tsx
import { useParams } from '@tanstack/react-router';
import { Calendar, Mail, MapPin, Phone, User } from 'lucide-react';

import type { TeamMember } from '~/entities/team';

import { Button, Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';

// Mock function - später durch API-Call ersetzen
function getTeamMemberById(id: string): TeamMember | undefined {
  const mockMembers: Array<TeamMember> = [
    {
      id: '1',
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+49 123 456789',
      role: 'Senior Entwickler',
      department: 'IT',
      status: 'active',
      bio: 'Erfahrener Full-Stack Entwickler mit Fokus auf React und Node.js. Liebt es, komplexe Probleme zu lösen und neue Technologien zu erkunden.',
      startDate: new Date('2020-03-15'),
      birthDate: new Date('1990-05-20'),
      newsletter: true,
      remoteWork: true,
      address: {
        street: 'Musterstraße 123',
        city: 'Berlin',
        country: 'Deutschland',
        postalCode: '10115',
      },
    },
    {
      id: '2',
      firstName: 'Anna',
      lastName: 'Schmidt',
      email: 'anna@example.com',
      phone: '+49 234 567890',
      role: 'Projektleiterin',
      department: 'Management',
      status: 'active',
      bio: 'Erfahrene Projektleiterin mit über 10 Jahren Erfahrung in der IT-Branche. Spezialisiert auf agile Methoden.',
      startDate: new Date('2018-06-01'),
      newsletter: false,
      remoteWork: false,
    },
    // ... weitere Mock-Daten
  ];

  return mockMembers.find((member) => member.id === id);
}

export function TeamDetailPage() {
  const { memberId } = useParams({ from: '/team/$memberId' });
  const member = getTeamMemberById(memberId);

  if (!member) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Teammitglied nicht gefunden</p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              Zurück zur Übersicht
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
      <div className="mb-6">
        <Button variant="ghost" onClick={() => window.history.back()}>
          ← Zurück zur Übersicht
        </Button>
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
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[member.status]}`}
                >
                  {statusLabels[member.status]}
                </span>
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
                      {member.startDate.toLocaleDateString('de-DE', {
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
                  {member.birthDate.toLocaleDateString('de-DE', {
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
