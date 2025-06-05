/**
 * Zentrale Label-Konfiguration für die gesamte Anwendung
 * @module shared/config/labels
 */

// Base field labels - werden in mehreren Entities verwendet
export const baseFieldLabels = {
  // Person/User fields
  firstName: 'Vorname',
  lastName: 'Nachname',
  email: 'E-Mail-Adresse',
  phone: 'Telefonnummer',
  bio: 'Biografie',
  birthDate: 'Geburtsdatum',

  // Address fields
  street: 'Straße',
  city: 'Stadt',
  country: 'Land',
  postalCode: 'Postleitzahl',

  // Common fields
  name: 'Name',
  description: 'Beschreibung',
  status: 'Status',
  createdAt: 'Erstellt am',
  updatedAt: 'Aktualisiert am',

  // Preferences
  newsletter: 'Newsletter abonnieren',
  acceptTerms: 'AGB akzeptieren',
} as const;

// Helper function to get nested labels
export function getNestedLabel(path: string, labels: Record<string, string>): string {
  const parts = path.split('.');
  const lastPart = parts[parts.length - 1];
  return labels[lastPart] || lastPart;
}
