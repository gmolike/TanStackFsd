// src/entities/location/model/labels.ts
import { createValidatedLabels } from '~/shared/types/label-validation';

import type { Location } from './schema';

/**
 * Type-safe Location Labels
 */
export const locationLabels = createValidatedLabels<Location, 'actions'>({
  id: 'ID',
  name: 'Name',
  code: 'Code',
  type: 'Typ',
  status: 'Status',
  address: 'Adresse',
  managerId: 'Manager ID',
  description: 'Beschreibung',
  capacity: 'Kapazität',
  capacityUnit: 'Kapazitätseinheit',
  operatingHours: 'Öffnungszeiten',
  createdAt: 'Erstellt am',
  updatedAt: 'Aktualisiert am',

  // Virtual fields
  actions: 'Aktionen',
});

/**
 * Location Info Labels für Detail-Ansichten
 */
export const locationInfoLabels = {
  basicInfo: 'Grundinformationen',
  addressInfo: 'Adressinformationen',
  capacityInfo: 'Kapazitätsinformationen',
  operatingInfo: 'Betriebsinformationen',
} as const;
