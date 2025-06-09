// src/entities/team/model/labels.ts
import { baseFieldLabels } from '~/shared/config/labels';

/**
 * Team Entity Labels - Zentrale Label-Verwaltung
 * @description Alle Labels für die Team Entity sind hier zentral definiert
 */

// Basis Team Labels
export const teamBaseLabels = {
  ...baseFieldLabels,

  // Team-spezifische Felder
  role: 'Rolle',
  department: 'Abteilung',
  startDate: 'Eintrittsdatum',
  remoteWork: 'Remote-Arbeit',
  teamMembers: 'Teammitglieder',
  locationId: 'Standort',

  // Zusätzliche Team-Labels
  teamSize: 'Teamgröße',
  teamLead: 'Teamleiter',
} as const;

// Adress-Labels (verschachtelt)
export const teamAddressLabels = {
  _title: 'Adresse',
  street: 'Straße',
  city: 'Stadt',
  country: 'Land',
  postalCode: 'Postleitzahl',
} as const;

// Status-Labels
export const teamStatusLabels = {
  _title: 'Status',
  active: 'Aktiv',
  inactive: 'Inaktiv',
  vacation: 'Im Urlaub',
} as const;

// Tabellen-spezifische Labels
export const teamTableLabels = {
  name: 'Name',
  email: 'E-Mail',
  role: 'Rolle',
  department: 'Abteilung',
  phone: 'Telefon',
  status: 'Status',
  actions: 'Aktionen',
  remoteWork: 'Remote',
  contact: 'Kontakt',
} as const;

// Info-Labels für Detail-Ansichten
export const teamInfoLabels = {
  personalInfo: 'Persönliche Informationen',
  professionalInfo: 'Berufliche Informationen',
  contactInfo: 'Kontaktinformationen',
  settings: 'Einstellungen',
  aboutMe: 'Über mich',
  position: 'Position',
} as const;

// Kombinierte Labels für einfachen Zugriff
export const teamLabels = {
  ...teamBaseLabels,
  address: teamAddressLabels,
  status: teamStatusLabels,
  table: teamTableLabels,
  info: teamInfoLabels,
} as const;

// Type Exports
export type TeamLabelKey = keyof typeof teamBaseLabels;
export type TeamAddressLabelKey = keyof typeof teamAddressLabels;
export type TeamStatusLabelKey = keyof typeof teamStatusLabels;
export type TeamTableLabelKey = keyof typeof teamTableLabels;
export type TeamInfoLabelKey = keyof typeof teamInfoLabels;

// Helper Functions
export const getTeamLabel = (key: TeamLabelKey): string => teamBaseLabels[key];

export const getAddressLabel = (key: TeamAddressLabelKey): string => teamAddressLabels[key];

export const getStatusLabel = (status: keyof typeof teamStatusLabels): string =>
  teamStatusLabels[status];

export const getTableLabel = (key: TeamTableLabelKey): string => teamTableLabels[key];
