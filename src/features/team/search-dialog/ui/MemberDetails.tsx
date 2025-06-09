// src/features/team/search-dialog/ui/MemberDetails.tsx
import { Building2, Calendar, Mail, Phone, User } from 'lucide-react';

import { TeamStatusBadge } from '~/entities/team';

import { Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';

import type { MemberDetailsProps } from '../model/types';

/**
 * Zeigt Details eines ausgewählten Team-Mitglieds
 *
 * @component
 * @param props - MemberDetails Konfiguration
 */
export const MemberDetails = ({ member }: MemberDetailsProps) => {
  if (!member) {
    return (
      <Card className="flex h-full flex-col">
        <CardContent className="flex flex-1 items-center justify-center py-12">
          <div className="text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">Kein Mitglied ausgewählt</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Wählen Sie ein Teammitglied aus der Liste aus
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {member.firstName} {member.lastName}
          </span>
          <TeamStatusBadge status={member.status} />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Rolle */}
        <div className="flex items-start gap-3">
          <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Position</p>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>
        </div>

        {/* Abteilung */}
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Abteilung</p>
            <p className="text-sm text-muted-foreground">{member.department}</p>
          </div>
        </div>

        {/* E-Mail */}
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">E-Mail</p>
            <a
              href={`mailto:${member.email}`}
              className="text-sm text-primary hover:underline"
              onClick={(e) => e.preventDefault()} // Verhindere Mail-Client im Dialog
            >
              {member.email}
            </a>
          </div>
        </div>

        {/* Telefon */}
        {member.phone && (
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Telefon</p>
              <p className="text-sm text-muted-foreground">{member.phone}</p>
            </div>
          </div>
        )}

        {/* Eintrittsdatum */}
        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Eintrittsdatum</p>
            <p className="text-sm text-muted-foreground">
              {new Date(member.startDate).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Remote Work Status */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Remote Work</span>
            <span
              className={`text-sm font-medium ${member.remoteWork ? 'text-green-600' : 'text-gray-500'}`}
            >
              {member.remoteWork ? 'Ja' : 'Nein'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
