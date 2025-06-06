// src/entities/location/api/mock-data.ts

import { array, random, string } from '~/shared/mock';

import { mockTeamMembers } from '~/entities/team/api/mock-data';

import {
  capacityUnitOptions,
  locationStatusOptions,
  locationTypeOptions,
  mockCities,
  operatingHoursTemplates,
  storageLocationPrefixes,
} from '../model/options';
import type {
  Address,
  CreateLocation,
  CreateLocationInventory,
  Location,
  LocationInventory,
  OperatingHours,
} from '../model/schema';

/**
 * Generiert Mock-Daten für eine Adresse
 */
const generateAddress = (city?: (typeof mockCities)[number]): Address => {
  const selectedCity = city || random.arrayElement(mockCities);
  return {
    street: `${string.street()} ${random.number(1, 200)}`,
    city: selectedCity.name,
    postalCode: selectedCity.postalCode,
    country: selectedCity.country,
  };
};

/**
 * Generiert Öffnungszeiten basierend auf Standorttyp
 */
const generateOperatingHours = (type: Location['type']): OperatingHours | undefined => {
  if (type === 'warehouse' && random.boolean(0.3)) {
    return operatingHoursTemplates.twentyFourSeven.hours;
  }

  const templateKey =
    type === 'office'
      ? 'office'
      : type === 'store'
        ? 'store'
        : type === 'warehouse'
          ? 'warehouse'
          : 'office';
  const template = operatingHoursTemplates[templateKey];
  return random.boolean(0.8) ? template.hours : undefined;
};

/**
 * Generiert einen eindeutigen Standort-Code
 */
const generateLocationCode = (type: Location['type'], city: string): string => {
  const typePrefix = type.substring(0, 1).toUpperCase();
  const cityPrefix = city.substring(0, 3).toUpperCase();
  const number = random.number(1, 99).toString().padStart(2, '0');
  return `${typePrefix}${cityPrefix}-${number}`;
};

/**
 * Generiert einen einzelnen Standort
 */
export const generateLocation = (overrides?: Partial<CreateLocation>): Location => {
  const type =
    overrides?.type || (random.arrayElement(Object.keys(locationTypeOptions)) as Location['type']);
  const city = overrides?.address?.city
    ? mockCities.find((c) => c.name === overrides.address?.city) || random.arrayElement(mockCities)
    : random.arrayElement(mockCities);

  const address = overrides?.address || generateAddress(city);
  const code = overrides?.code || generateLocationCode(type, address.city);

  // Kapazität basierend auf Typ
  const capacityRanges = {
    warehouse: { min: 1000, max: 10000, unit: 'sqm' as const },
    office: { min: 100, max: 1000, unit: 'sqm' as const },
    store: { min: 50, max: 500, unit: 'sqm' as const },
    production: { min: 500, max: 5000, unit: 'sqm' as const },
  };

  const capacityRange = capacityRanges[type];
  const capacity = random.number(capacityRange.min, capacityRange.max);

  // Manager aus Mock-Team-Daten
  const managers = Object.values(mockTeamMembers).filter(
    (member) => typeof member !== 'function' && member.role.toLowerCase().includes('manager'),
  );
  const managerId =
    random.boolean(0.9) && managers.length > 0 ? random.arrayElement(managers).id : undefined;

  // Wähle zufälligen Status
  const statusOptions: Array<Location['status']> = ['active', 'inactive', 'maintenance'];
  const status =
    overrides?.status ||
    (random.boolean(0.8) ? 'active' : random.boolean(0.75) ? 'inactive' : 'maintenance');

  const location: Location = {
    id: random.uuid(),
    name: overrides?.name || `${locationTypeOptions[type].label} ${address.city}`,
    code,
    type,
    status,
    address,
    managerId: overrides?.managerId || managerId,
    description:
      overrides?.description ||
      `${locationTypeOptions[type].label} in ${address.city}. ${string.lorem(20)}.`,
    capacity: overrides?.capacity || capacity,
    capacityUnit: overrides?.capacityUnit || capacityRange.unit,
    operatingHours: overrides?.operatingHours || generateOperatingHours(type),
    createdAt: random.date(new Date(2020, 0, 1), new Date(2023, 11, 31)),
    updatedAt: random.boolean(0.3) ? random.date(new Date(2024, 0, 1), new Date()) : undefined,
  };

  return location;
};

/**
 * Generiert Lagerplatz-Bezeichnung
 */
const generateStorageLocation = (locationType: Location['type']): string => {
  const prefixMap = {
    warehouse: storageLocationPrefixes.warehouse,
    store: storageLocationPrefixes.store,
    production: storageLocationPrefixes.production,
    office: ['O'], // Fallback für Office
  };

  const prefixes = prefixMap[locationType] || prefixMap.warehouse;
  const prefix = random.arrayElement(prefixes);
  const row = random.number(1, 20);
  const shelf = random.number(1, 10);
  const level = random.number(1, 5);

  return `${prefix}-${row}-${shelf}-${level}`;
};

/**
 * Generiert Lagerbestand für einen Standort
 */
export const generateLocationInventory = (
  locationId: string,
  articleId: string,
  locationType: Location['type'] = 'warehouse',
  overrides?: Partial<CreateLocationInventory>,
): LocationInventory => {
  const stock = overrides?.stock ?? random.number(0, 200);
  const minStock = overrides?.minStock ?? random.number(5, 20);
  const maxStock = overrides?.maxStock ?? random.number(100, 500);
  const reservedStock =
    overrides?.reservedStock ?? (stock > 0 ? random.number(0, Math.floor(stock * 0.3)) : 0);

  const inventory: LocationInventory = {
    id: random.uuid(),
    locationId,
    articleId,
    stock,
    reservedStock,
    minStock,
    maxStock,
    storageLocation: overrides?.storageLocation || generateStorageLocation(locationType),
    lastInventoryDate: random.boolean(0.7)
      ? random.date(new Date(2024, 0, 1), new Date())
      : undefined,
    lastInventoryBy: random.boolean(0.7) ? random.uuid() : undefined,
    createdAt: random.date(new Date(2023, 0, 1), new Date()),
    updatedAt: random.boolean(0.3) ? random.date(new Date(2024, 0, 1), new Date()) : undefined,
  };

  return inventory;
};

/**
 * Generiert mehrere Standorte
 */
export const generateLocations = (
  count: number,
  overrides?: Partial<CreateLocation>,
): Array<Location> => array.of(count, () => generateLocation(overrides));

/**
 * Generiert Standorte für eine spezifische Stadt
 */
export const generateLocationsByCity = (city: string, count: number): Array<Location> => {
  const cityData = mockCities.find((c) => c.name === city);
  if (!cityData) return [];

  return array.of(count, () =>
    generateLocation({
      address: generateAddress(cityData),
    }),
  );
};

/**
 * Generiert einen kompletten Satz von Standorten (verschiedene Typen)
 */
export const generateLocationMix = (totalCount: number = 20): Array<Location> => {
  const types = Object.keys(locationTypeOptions) as Array<Location['type']>;
  const locations: Array<Location> = [];

  // Hauptstandorte (einer pro Typ in großen Städten)
  const majorCities = mockCities.slice(0, 4);
  types.forEach((type, index) => {
    if (index < majorCities.length) {
      locations.push(
        generateLocation({
          type,
          address: generateAddress(majorCities[index]),
          status: 'active',
          name: `Haupt${locationTypeOptions[type].label} ${majorCities[index].name}`,
        }),
      );
    }
  });

  // Restliche Standorte verteilen
  const remaining = totalCount - locations.length;
  const perType = Math.floor(remaining / types.length);
  const remainder = remaining % types.length;

  types.forEach((type, index) => {
    const count = perType + (index < remainder ? 1 : 0);
    locations.push(...generateLocations(count, { type }));
  });

  return locations;
};

/**
 * Vordefinierte Beispiel-Standorte
 */
export const mockLocations = {
  // Hauptlager Berlin
  mainWarehouse: generateLocation({
    name: 'Hauptlager Berlin',
    code: 'WBER-01',
    type: 'warehouse',
    status: 'active',
    address: {
      street: 'Industriestraße 42',
      city: 'Berlin',
      postalCode: '12459',
      country: 'Deutschland',
    },
    capacity: 8500,
    capacityUnit: 'sqm',
    description:
      'Zentrales Warenlager für die Region Berlin-Brandenburg mit modernster Lagertechnik.',
  }),

  // Hauptbüro München
  headquarters: generateLocation({
    name: 'Zentrale München',
    code: 'OMUC-01',
    type: 'office',
    status: 'active',
    address: {
      street: 'Maximilianstraße 15',
      city: 'München',
      postalCode: '80539',
      country: 'Deutschland',
    },
    capacity: 2500,
    capacityUnit: 'sqm',
    description: 'Unternehmenszentrale mit Verwaltung und IT-Abteilung.',
  }),

  // Filiale Hamburg
  store: generateLocation({
    name: 'Filiale Hamburg City',
    code: 'SHAM-01',
    type: 'store',
    status: 'active',
    address: {
      street: 'Mönckebergstraße 7',
      city: 'Hamburg',
      postalCode: '20095',
      country: 'Deutschland',
    },
    capacity: 450,
    capacityUnit: 'sqm',
    description: 'Flagship Store in der Hamburger Innenstadt.',
  }),

  // Produktion Frankfurt
  production: generateLocation({
    name: 'Produktionswerk Frankfurt',
    code: 'PFRA-01',
    type: 'production',
    status: 'active',
    address: {
      street: 'Industriepark 23',
      city: 'Frankfurt',
      postalCode: '60386',
      country: 'Deutschland',
    },
    capacity: 3500,
    capacityUnit: 'sqm',
    description: 'Produktionsstätte für Eigenmarken und Sonderanfertigungen.',
  }),

  // Batch-Generatoren
  generateWarehouses: (count: number) => generateLocations(count, { type: 'warehouse' }),
  generateOffices: (count: number) => generateLocations(count, { type: 'office' }),
  generateStores: (count: number) => generateLocations(count, { type: 'store' }),
  generateAll: generateLocationMix,
};
