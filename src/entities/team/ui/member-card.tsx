import { Mail, MoreVertical, Phone } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/shared/shadcn';

import type { TeamMember } from '../model/schema';

import { TeamStatusBadge } from '..';

export type MemberCardProps = {
  member: TeamMember;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
};

export const MemberCard = ({ member, onEdit, onDelete, onClick }: MemberCardProps) => {
  const handleCardClick = () => {
    onClick?.();
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={handleCardClick}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <h3 className="font-semibold">
            {member.firstName} {member.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </div>
        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleMenuClick}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  Bearbeiten
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-destructive"
                >
                  Löschen
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{member.email}</span>
        </div>
        {member.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{member.phone}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium">{member.department}</span>
          <TeamStatusBadge status={member.status} />
        </div>
      </CardContent>
    </Card>
  );
};
