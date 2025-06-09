// src/entities/team/ui/member-info.tsx
import { Calendar, Mail, Phone, User } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

import { teamInfoLabels, teamLabels } from '../model/labels';
import type { TeamMember } from '../model/schema';

/**
 * CSDoc: Team Member Info Component
 * @description Zeigt strukturierte Informationen eines Teammitglieds an
 * @param member - Das anzuzeigende Teammitglied
 * @param className - Optionale CSS-Klassen
 */
export type MemberInfoProps = {
  member: TeamMember;
  className?: string;
};

// Info Item Component für wiederverwendbare Struktur
type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <div className="flex items-center gap-3">
    <div className="text-muted-foreground">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      {value}
    </div>
  </div>
);

export const MemberInfo = ({ member, className }: MemberInfoProps) => {
  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <div className={cn('grid gap-4 md:grid-cols-2', className)}>
      <InfoItem
        icon={<User className="h-4 w-4" />}
        label={teamLabels.role}
        value={<p className="font-medium">{member.role}</p>}
      />

      <InfoItem
        icon={<Mail className="h-4 w-4" />}
        label={teamLabels.email}
        value={
          <a href={`mailto:${member.email}`} className="font-medium text-primary hover:underline">
            {member.email}
          </a>
        }
      />

      {member.phone && (
        <InfoItem
          icon={<Phone className="h-4 w-4" />}
          label={teamLabels.phone}
          value={
            <a href={`tel:${member.phone}`} className="font-medium text-primary hover:underline">
              {member.phone}
            </a>
          }
        />
      )}

      <InfoItem
        icon={<Calendar className="h-4 w-4" />}
        label={teamLabels.startDate}
        value={<p className="font-medium">{formatDate(member.startDate)}</p>}
      />
    </div>
  );
};

/**
 * Extended Member Info für Detail-Ansichten
 * @description Erweiterte Informationsanzeige mit zusätzlichen Feldern
 */
export type ExtendedMemberInfoProps = {
  member: TeamMember;
  showBio?: boolean;
  showAddress?: boolean;
  className?: string;
};

export const ExtendedMemberInfo = ({
  member,
  showBio = true,
  showAddress = true,
  className,
}: ExtendedMemberInfoProps) => (
  <div className={cn('space-y-6', className)}>
    {/* Basis-Informationen */}
    <div>
      <h3 className="mb-4 text-lg font-semibold">{teamInfoLabels.contactInfo}</h3>
      <MemberInfo member={member} />
    </div>

    {/* Biografie */}
    {showBio && member.bio && (
      <div>
        <h3 className="mb-2 text-lg font-semibold">{teamInfoLabels.aboutMe}</h3>
        <p className="text-muted-foreground">{member.bio}</p>
      </div>
    )}

    {/* Adresse */}
    {showAddress && member.address && (
      <div>
        <h3 className="mb-2 text-lg font-semibold">{teamLabels.address._title}</h3>
        <address className="not-italic text-muted-foreground">
          <p>{member.address.street}</p>
          <p>
            {member.address.postalCode && `${member.address.postalCode} `}
            {member.address.city}
          </p>
          <p>{member.address.country}</p>
        </address>
      </div>
    )}

    {/* Einstellungen */}
    <div>
      <h3 className="mb-4 text-lg font-semibold">{teamInfoLabels.settings}</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">{teamLabels.newsletter}</span>
          <span
            className={cn(
              'text-sm font-medium',
              member.newsletter ? 'text-green-600' : 'text-gray-500',
            )}
          >
            {member.newsletter ? 'Aktiviert' : 'Deaktiviert'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">{teamLabels.remoteWork}</span>
          <span
            className={cn(
              'text-sm font-medium',
              member.remoteWork ? 'text-green-600' : 'text-gray-500',
            )}
          >
            {member.remoteWork ? 'Aktiviert' : 'Deaktiviert'}
          </span>
        </div>
      </div>
    </div>
  </div>
);
