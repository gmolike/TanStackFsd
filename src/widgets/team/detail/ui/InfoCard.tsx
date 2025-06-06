import type { TeamMember } from '~/entities/team';

import { Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';

import { InfoRow } from './InfoRow';

export const InfoCards = ({ member }: { member: TeamMember }) => (
  <>
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
        <InfoRow label="Newsletter" value={member.newsletter} />
        <InfoRow label="Remote Work" value={member.remoteWork} />
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
  </>
);
