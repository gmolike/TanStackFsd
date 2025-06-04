import { Link } from '@tanstack/react-router';
import { ChevronRight, Mail, Phone, User } from 'lucide-react';

import type { TeamMember } from '~/entities/team-member';

import { Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';

interface TeamListProps {
  teamMembers: Array<TeamMember>;
}

/**
 * TeamList Widget
 * Zeigt eine Liste von Teammitgliedern in Karten-Format an
 */
export function TeamList({ teamMembers }: TeamListProps) {
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teamMembers.map((member) => (
        <Link
          key={member.id}
          to="/team/$memberId"
          params={{ memberId: member.id }}
          className="group"
        >
          <Card className="h-full transition-all hover:border-primary/20 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg transition-colors group-hover:text-primary">
                      {member.firstName} {member.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{member.email}</span>
              </div>

              {member.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3">
                <span className="text-sm text-muted-foreground">{member.department}</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[member.status]}`}
                >
                  {statusLabels[member.status]}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
