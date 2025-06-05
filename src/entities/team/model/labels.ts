import { baseFieldLabels } from '~/shared/config/labels';

// Team entity labels - erweitert die base labels
export const teamLabels = {
  ...baseFieldLabels,

  // Team-specific fields
  role: 'Rolle',
  department: 'Abteilung',
  startDate: 'Eintrittsdatum',
  remoteWork: 'Remote-Arbeit',
  teamMembers: 'Teammitglieder',

  // Project fields
  projectStartDate: 'Projektstart',
  projectEndDate: 'Projektende',
  framework: 'Framework',

  // Additional team-specific labels
  teamSize: 'Teamgröße',
  teamLead: 'Teamleiter',

  // Address nested labels (für Formulare)
  address: 'Adresse',
  'address.street': 'Straße',
  'address.city': 'Stadt',
  'address.country': 'Land',
  'address.postalCode': 'Postleitzahl',
} as const;

// Type für Label-Keys
export type TeamLabelKey = keyof typeof teamLabels;

// Helper für spezifische Label-Gruppen
export const teamAddressLabels = {
  street: teamLabels.street,
  city: teamLabels.city,
  country: teamLabels.country,
  postalCode: teamLabels.postalCode,
} as const;
