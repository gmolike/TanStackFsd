// src/entities/location/model/options.ts

/**
 * Standorttyp-Optionen
 */
export const locationTypeOptions = {
  warehouse: {
    value: 'warehouse',
    label: 'Lager',
    icon: '🏭',
    color: 'blue',
  },
  office: {
    value: 'office',
    label: 'Büro',
    icon: '🏢',
    color: 'gray',
  },
  store: {
    value: 'store',
    label: 'Filiale',
    icon: '🏪',
    color: 'green',
  },
  production: {
    value: 'production',
    label: 'Produktion',
    icon: '🏗️',
    color: 'orange',
  },
} as const;

export const locationTypeOptionsList = Object.values(locationTypeOptions);

/**
 * Status-Optionen
 */
export const locationStatusOptions = {
  active: {
    value: 'active',
    label: 'Aktiv',
    color: 'green',
  },
  inactive: {
    value: 'inactive',
    label: 'Inaktiv',
    color: 'gray',
  },
  maintenance: {
    value: 'maintenance',
    label: 'Wartung',
    color: 'yellow',
  },
} as const;

export const locationStatusOptionsList = Object.values(locationStatusOptions);

/**
 * Kapazitätseinheiten
 */
export const capacityUnitOptions = {
  sqm: {
    value: 'sqm',
    label: 'm²',
    description: 'Quadratmeter',
  },
  pallets: {
    value: 'pallets',
    label: 'Paletten',
    description: 'Palettenstellplätze',
  },
  units: {
    value: 'units',
    label: 'Einheiten',
    description: 'Lagereinheiten',
  },
} as const;

export const capacityUnitOptionsList = Object.values(capacityUnitOptions);

/**
 * Standard-Öffnungszeiten Templates
 */
export const operatingHoursTemplates = {
  office: {
    name: 'Bürozeiten',
    hours: {
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
    },
  },
  warehouse: {
    name: 'Lagerzeiten',
    hours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '08:00', close: '16:00' },
    },
  },
  store: {
    name: 'Ladenöffnungszeiten',
    hours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
    },
  },
  twentyFourSeven: {
    name: '24/7',
    hours: {
      monday: { open: '00:00', close: '23:59' },
      tuesday: { open: '00:00', close: '23:59' },
      wednesday: { open: '00:00', close: '23:59' },
      thursday: { open: '00:00', close: '23:59' },
      friday: { open: '00:00', close: '23:59' },
      saturday: { open: '00:00', close: '23:59' },
      sunday: { open: '00:00', close: '23:59' },
    },
  },
} as const;

/**
 * Lagerplatz-Präfixe (für Mock-Daten)
 */
export const storageLocationPrefixes = {
  warehouse: ['A', 'B', 'C', 'D', 'E', 'F'],
  store: ['L', 'R', 'B'], // Links, Rechts, Back
  production: ['P', 'M', 'S'], // Production, Material, Storage
} as const;

/**
 * Städte für Mock-Daten
 */
export const mockCities = [
  { name: 'Berlin', postalCode: '10115', country: 'Deutschland' },
  { name: 'Hamburg', postalCode: '20095', country: 'Deutschland' },
  { name: 'München', postalCode: '80331', country: 'Deutschland' },
  { name: 'Köln', postalCode: '50667', country: 'Deutschland' },
  { name: 'Frankfurt', postalCode: '60311', country: 'Deutschland' },
  { name: 'Stuttgart', postalCode: '70173', country: 'Deutschland' },
  { name: 'Düsseldorf', postalCode: '40213', country: 'Deutschland' },
  { name: 'Leipzig', postalCode: '04109', country: 'Deutschland' },
  { name: 'Dortmund', postalCode: '44135', country: 'Deutschland' },
  { name: 'Essen', postalCode: '45127', country: 'Deutschland' },
] as const;
