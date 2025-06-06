import { Calendar, Mail, Phone, User } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

import type { TeamMember } from '../model/schema';

export type MemberInfoProps = {
  member: TeamMember;
  className?: string;
};

export const MemberInfo = ({ member, className }: MemberInfoProps) => (
  <div className={cn('grid gap-4 md:grid-cols-2', className)}>
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
        <a href={`mailto:${member.email}`} className="font-medium text-primary hover:underline">
          {member.email}
        </a>
      </div>
    </div>

    {member.phone && (
      <div className="flex items-center gap-3">
        <Phone className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm text-muted-foreground">Telefon</p>
          <a href={`tel:${member.phone}`} className="font-medium text-primary hover:underline">
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
);
