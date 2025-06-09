// src/pages/locations/detail/ui/team-tab.tsx
import { useNavigate } from '@tanstack/react-router';
import { Mail, Phone, User, UserCheck } from 'lucide-react';

import { useLocationManager, useLocationTeamMembers } from '~/entities/location';
import type { TeamMember } from '~/entities/team';

import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/shared/shadcn';

interface TeamTabProps {
  locationId: string;
  managerId?: string;
}

export function TeamTab({ locationId, managerId }: TeamTabProps) {
  const navigate = useNavigate();

  // API Hooks
  const { data: teamData, isLoading: isLoadingTeam } = useLocationTeamMembers(locationId);
  const { data: manager, isLoading: isLoadingManager } = useLocationManager(locationId);

  const teamMembers = teamData?.data || [];

  const getInitials = (member: TeamMember) =>
    `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();

  const getStatusColor = (status: TeamMember['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      vacation: 'bg-blue-100 text-blue-800',
    };
    return colors[status];
  };

  const getStatusLabel = (status: TeamMember['status']) => {
    const labels = {
      active: 'Aktiv',
      inactive: 'Inaktiv',
      vacation: 'Urlaub',
    };
    return labels[status];
  };

  // Manager Card
  const renderManagerCard = () => {
    if (isLoadingManager) {
      return (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Lade Standortleiter...</p>
          </CardContent>
        </Card>
      );
    }

    if (!manager) {
      return (
        <Card>
          <CardContent className="py-8 text-center">
            <UserCheck className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">Kein Standortleiter zugewiesen</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => navigate({ to: '/team/$memberId', params: { memberId: manager.id } })}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Standortleiter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{getInitials(manager)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">
                {manager.firstName} {manager.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{manager.role}</p>

              <div className="mt-3 space-y-1">
                <a
                  href={`mailto:${manager.email}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="h-3 w-3" />
                  {manager.email}
                </a>
                {manager.phone && (
                  <a
                    href={`tel:${manager.phone}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="h-3 w-3" />
                    {manager.phone}
                  </a>
                )}
              </div>
            </div>
            <Badge className={getStatusColor(manager.status)}>
              {getStatusLabel(manager.status)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Empty State
  if (!isLoadingTeam && teamMembers.length === 0 && !manager) {
    return (
      <div className="space-y-6">
        {renderManagerCard()}

        <Card>
          <CardContent className="py-12 text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">Keine Mitarbeiter zugewiesen</p>
            <p className="mt-2 text-muted-foreground">
              Diesem Standort sind noch keine Mitarbeiter zugeordnet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Manager */}
      {renderManagerCard()}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Mitarbeiter am Standort</CardTitle>
          <CardDescription>
            {teamMembers.length} Mitarbeiter arbeiten an diesem Standort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => navigate({ to: '/team/$memberId', params: { memberId: member.id } })}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(member)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold">
                            {member.firstName} {member.lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <p className="text-xs text-muted-foreground">{member.department}</p>
                        </div>
                        {member.id === managerId && <UserCheck className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="space-y-1 pt-2">
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </a>
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getStatusColor(member.status)}`}
                    >
                      {getStatusLabel(member.status)}
                    </Badge>
                    {member.remoteWork && (
                      <span className="text-xs text-muted-foreground">Remote</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
