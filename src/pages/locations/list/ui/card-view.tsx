// src/pages/locations/list/ui/card-view.tsx
import { useNavigate } from '@tanstack/react-router';
import { Building2, MapPin, Package, Users } from 'lucide-react';

import type { Location } from '~/entities/location';
import { locationStatusOptions, locationTypeOptions } from '~/entities/location';

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/shadcn';

interface LocationCardViewProps {
  locations: Array<Location>;
}

export function LocationCardView({ locations }: LocationCardViewProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: Location['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status];
  };

  const getTypeIcon = (type: Location['type']) => {
    const icons = {
      warehouse: <Package className="h-5 w-5" />,
      office: <Building2 className="h-5 w-5" />,
      store: <MapPin className="h-5 w-5" />,
      production: <Building2 className="h-5 w-5" />,
    };
    return icons[type];
  };

  const getTypeColor = (type: Location['type']) => {
    const colors = {
      warehouse: 'text-blue-600',
      office: 'text-gray-600',
      store: 'text-green-600',
      production: 'text-orange-600',
    };
    return colors[type];
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
        <Card
          key={location.id}
          className="cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() =>
            navigate({ to: '/locations/$locationId', params: { locationId: location.id } })
          }
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className={getTypeColor(location.type)}>{getTypeIcon(location.type)}</div>
                <div>
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                  <CardDescription>{location.code}</CardDescription>
                </div>
              </div>
              <Badge className={getStatusColor(location.status)}>
                {locationStatusOptions[location.status].label}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Adresse */}
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p>{location.address.street}</p>
                <p>
                  {location.address.postalCode} {location.address.city}
                </p>
              </div>
            </div>

            {/* Typ */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Typ</span>
              <span className="font-medium">{locationTypeOptions[location.type].label}</span>
            </div>

            {/* Kapazität */}
            {location.capacity && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Kapazität</span>
                <span className="font-medium">
                  {location.capacity.toLocaleString('de-DE')} {location.capacityUnit}
                </span>
              </div>
            )}

            {/* Quick Stats (Mock für jetzt) */}
            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 20 + 5)}</span>
              </div>
              {(location.type === 'warehouse' || location.type === 'store') && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{Math.floor(Math.random() * 100 + 50)} Artikel</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
