import { MapPin } from 'lucide-react';

import type { TeamMember } from '~/entities/team';

import { Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';

export const AddressCard = ({ address }: { address: TeamMember['address'] }) => {
  if (!address) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Adresse
        </CardTitle>
      </CardHeader>
      <CardContent>
        <address className="not-italic">
          <p>{address.street}</p>
          <p>
            {address.postalCode} {address.city}
          </p>
          <p>{address.country}</p>
        </address>
      </CardContent>
    </Card>
  );
};
