// entities/team/model/labels-validated.ts
import { createValidatedLabels } from '~/shared/types/label-validation';

import type { TeamMember } from './schema';

/**
 * Team Labels - Zentrale Label-Verwaltung
 * Type-safe: Jedes Feld muss ein Label haben
 */

/**
 * Type-safe Team Labels
 */
// entities/team/model/labels-validated.ts (Alternative)
export const teamLabels = createValidatedLabels<TeamMember, 'name' | 'actions'>({
  id: 'ID',
  firstName: 'Vorname',
  lastName: 'Nachname',
  email: 'E-Mail',
  phone: 'Telefon',
  role: 'Rolle',
  department: 'Abteilung',
  status: 'Status',
  bio: 'Biografie',
  birthDate: 'Geburtsdatum',
  startDate: 'Eintrittsdatum',
  newsletter: 'Newsletter',
  remoteWork: 'Remote-Arbeit',
  locationId: 'Standort',

  // Address - handle null/undefined
  address: 'Adresse',

  // Virtual fields
  name: 'Name',
  actions: 'Aktionen',
});

/**
 * Dashboard-spezifische Labels
 */
export const dashboardLabels = {
  nameWithRole: 'Teammitglied',
  contact: 'Kontakt',
  remoteWork: 'Remote',
} as const;

/**
 * Team Info Labels für Detail-Ansichten
 */
export const teamInfoLabels = {
  contactInfo: 'Kontaktinformationen',
  aboutMe: 'Über mich',
  settings: 'Einstellungen',
  address: {
    _title: 'Adresse',
    street: 'Straße',
    city: 'Stadt',
    postalCode: 'Postleitzahl',
    country: 'Land',
  },
} as const;
