// entities/team/model/labels.ts
import type { TeamMember } from './schema';

/**
 * Team Labels - Zentrale Label-Verwaltung
 * Type-safe: Jedes Feld muss ein Label haben
 */
export const teamLabels: Record<keyof TeamMember | 'name' | 'actions', string> = {
  // Basis-Felder
  id: 'ID',
  firstName: 'Vorname',
  lastName: 'Nachname',
  email: 'E-Mail',
  phone: 'Telefon',

  // Berufliche Informationen
  role: 'Rolle',
  department: 'Abteilung',
  status: 'Status',

  // Daten
  birthDate: 'Geburtsdatum',
  startDate: 'Eintrittsdatum',

  // Präferenzen
  newsletter: 'Newsletter',
  remoteWork: 'Remote-Arbeit',

  // Weitere Felder
  bio: 'Biografie',
  locationId: 'Standort',
  address: 'Adresse',

  // Kombinierte/Virtuelle Felder
  name: 'Name',
  actions: 'Aktionen',
} as const;

/**
 * Dashboard-spezifische Labels
 */
export const dashboardLabels = {
  nameWithRole: 'Teammitglied',
  contact: 'Kontakt',
  remoteWork: 'Remote',
} as const;
