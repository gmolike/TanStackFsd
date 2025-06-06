// src/pages/locations/detail/ui/overview-tab.tsx
import { Calendar, Clock, MapPin } from 'lucide-react';

import type { Location } from '~/entities/location';
import {
  capacityUnitOptions,
  locationStatusOptions,
  locationTypeOptions,
} from '~/entities/location';

import { Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';

interface OverviewTabProps {
  location: Location;
}

export function OverviewTab({ location }: OverviewTabProps) {
  const formatOperatingHours = (hours: Location['operatingHours']) => {
    if (!hours) return null;

    const days = [
      { key: 'monday', label: 'Montag' },
      { key: 'tuesday', label: 'Dienstag' },
      { key: 'wednesday', label: 'Mittwoch' },
      { key: 'thursday', label: 'Donnerstag' },
      { key: 'friday', label: 'Freitag' },
      { key: 'saturday', label: 'Samstag' },
      { key: 'sunday', label: 'Sonntag' },
    ];

    return days
      .map(({ key, label }) => {
        const dayHours = hours[key as keyof typeof hours];
        if (!dayHours) return null;

        return (
          <div key={key} className="flex justify-between py-1">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">
              {dayHours.open} - {dayHours.close}
            </span>
          </div>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Allgemeine Informationen */}
      <Card>
        <CardHeader>
          <CardTitle>Allgemeine Informationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Typ</p>
            <div className="flex items-center gap-2">
              <span className="text-xl">{locationTypeOptions[location.type].icon}</span>
              <p className="font-medium">{locationTypeOptions[location.type].label}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">{locationStatusOptions[location.status].label}</p>
          </div>

          {location.capacity && (
            <div>
              <p className="text-sm text-muted-foreground">Kapazität</p>
              <p className="font-medium">
                {location.capacity.toLocaleString('de-DE')}{' '}
                {location.capacityUnit && capacityUnitOptions[location.capacityUnit]?.label}
              </p>
            </div>
          )}

          {location.description && (
            <div>
              <p className="text-sm text-muted-foreground">Beschreibung</p>
              <p className="font-medium">{location.description}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">Angelegt am</p>
            <p className="font-medium">
              {new Date(location.createdAt).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>

          {location.updatedAt && (
            <div>
              <p className="text-sm text-muted-foreground">Zuletzt aktualisiert</p>
              <p className="font-medium">
                {new Date(location.updatedAt).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adresse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Adresse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <address className="space-y-1 not-italic">
            <p className="font-medium">{location.address.street}</p>
            <p>
              {location.address.postalCode} {location.address.city}
            </p>
            <p>{location.address.country}</p>
          </address>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Tipp: Sie können die Adresse in Google Maps öffnen, um eine Wegbeschreibung zu
              erhalten.
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${location.address.street}, ${location.address.postalCode} ${location.address.city}, ${location.address.country}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <MapPin className="h-4 w-4" />
              In Google Maps öffnen
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Öffnungszeiten */}
      {location.operatingHours && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Öffnungszeiten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {formatOperatingHours(location.operatingHours)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
