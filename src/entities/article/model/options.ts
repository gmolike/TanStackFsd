// src/entities/article/model/options.ts

/**
 * Options für Select/Combobox Felder im Article Entity
 * Folgt dem gleichen Muster wie team/model/options.ts
 */

// Helper-Funktion zum Konvertieren von Options zu Arrays
export const optionsToArray = <T extends Record<string, { value: string; label: string }>>(
  options: T,
): Array<{ value: string; label: string }> => Object.values(options);

// Article Status Options
export const articleStatusOptions = {
  available: { value: 'available', label: 'Verfügbar' },
  unavailable: { value: 'unavailable', label: 'Nicht verfügbar' },
  discontinued: { value: 'discontinued', label: 'Eingestellt' },
  coming_soon: { value: 'coming_soon', label: 'Demnächst' },
} as const;

// Kategorie Options
export const articleCategoryOptions = {
  elektronik: { value: 'Elektronik', label: 'Elektronik' },
  computer: { value: 'Computer', label: 'Computer' },
  zubehoer: { value: 'Zubehör', label: 'Zubehör' },
  software: { value: 'Software', label: 'Software' },
  gaming: { value: 'Gaming', label: 'Gaming' },
  buero: { value: 'Büro', label: 'Büro' },
  haushalt: { value: 'Haushalt', label: 'Haushalt' },
  kleidung: { value: 'Kleidung', label: 'Kleidung' },
  sport: { value: 'Sport', label: 'Sport' },
  medien: { value: 'Medien', label: 'Medien' },
} as const;

// Unterkategorie Options (abhängig von Kategorie)
export const articleSubcategoryOptions = {
  // Elektronik
  smartphones: { value: 'Smartphones', label: 'Smartphones', category: 'Elektronik' },
  tablets: { value: 'Tablets', label: 'Tablets', category: 'Elektronik' },
  kameras: { value: 'Kameras', label: 'Kameras', category: 'Elektronik' },
  fernseher: { value: 'Fernseher', label: 'Fernseher', category: 'Elektronik' },

  // Computer
  laptops: { value: 'Laptops', label: 'Laptops', category: 'Computer' },
  desktops: { value: 'Desktops', label: 'Desktop PCs', category: 'Computer' },
  monitore: { value: 'Monitore', label: 'Monitore', category: 'Computer' },
  drucker: { value: 'Drucker', label: 'Drucker', category: 'Computer' },

  // Zubehör
  eingabegeraete: { value: 'Eingabegeräte', label: 'Eingabegeräte', category: 'Zubehör' },
  adapter: { value: 'Adapter', label: 'Adapter & Kabel', category: 'Zubehör' },
  staender: { value: 'Ständer', label: 'Ständer & Halterungen', category: 'Zubehör' },
  taschen: { value: 'Taschen', label: 'Taschen & Hüllen', category: 'Zubehör' },
} as const;

// Einheiten Options
export const articleUnitOptions = {
  stueck: { value: 'Stück', label: 'Stück' },
  paket: { value: 'Paket', label: 'Paket' },
  karton: { value: 'Karton', label: 'Karton' },
  palette: { value: 'Palette', label: 'Palette' },
  meter: { value: 'Meter', label: 'Meter' },
  liter: { value: 'Liter', label: 'Liter' },
  kilogramm: { value: 'Kilogramm', label: 'Kilogramm' },
  lizenz: { value: 'Lizenz', label: 'Lizenz' },
} as const;

// Maßeinheiten für Dimensionen
export const dimensionUnitOptions = {
  cm: { value: 'cm', label: 'Zentimeter' },
  mm: { value: 'mm', label: 'Millimeter' },
  m: { value: 'm', label: 'Meter' },
} as const;

// Steuersatz Options
export const taxRateOptions = {
  normal: { value: 19, label: '19% (Normal)' },
  reduced: { value: 7, label: '7% (Ermäßigt)' },
  zero: { value: 0, label: '0% (Steuerfrei)' },
} as const;

// Häufig verwendete Tags
export const articleTagOptions = {
  neu: { value: 'Neu', label: 'Neu' },
  sale: { value: 'Sale', label: 'Sale' },
  bestseller: { value: 'Bestseller', label: 'Bestseller' },
  premium: { value: 'Premium', label: 'Premium' },
  oeko: { value: 'Öko', label: 'Öko' },
  handmade: { value: 'Handmade', label: 'Handmade' },
  limitiert: { value: 'Limitiert', label: 'Limitiert' },
  vorbestellung: { value: 'Vorbestellung', label: 'Vorbestellung' },
  b_ware: { value: 'B-Ware', label: 'B-Ware' },
  restposten: { value: 'Restposten', label: 'Restposten' },
} as const;

// Export als Arrays für direkte Verwendung in Selects
export const articleStatusOptionsList = optionsToArray(articleStatusOptions);
export const articleCategoryOptionsList = optionsToArray(articleCategoryOptions);
export const articleUnitOptionsList = optionsToArray(articleUnitOptions);
export const dimensionUnitOptionsList = optionsToArray(dimensionUnitOptions);
export const taxRateOptionsList = taxRateOptions; // Spezialfall wegen number values
export const articleTagOptionsList = optionsToArray(articleTagOptions);

// Helper-Funktion für Unterkategorien basierend auf Kategorie
export const getSubcategoryOptions = (category: string): Array<{ value: string; label: string }> =>
  Object.values(articleSubcategoryOptions)
    .filter((option) => option.category === category)
    .map(({ value, label }) => ({ value, label }));

// Type exports
export type ArticleStatus = keyof typeof articleStatusOptions;
export type ArticleCategory =
  (typeof articleCategoryOptions)[keyof typeof articleCategoryOptions]['value'];
export type ArticleUnit = (typeof articleUnitOptions)[keyof typeof articleUnitOptions]['value'];
export type DimensionUnit = keyof typeof dimensionUnitOptions;
export type TaxRate = (typeof taxRateOptions)[keyof typeof taxRateOptions]['value'];

// Predefined Lieferanten für Mock-Daten
export const supplierOptions = {
  megaElectronics: {
    id: 'SUP-001',
    name: 'Mega Electronics GmbH',
    contactPerson: 'Thomas Müller',
    email: 'thomas@megaelectronics.de',
    phone: '+49 30 12345678',
  },
  techDistribution: {
    id: 'SUP-002',
    name: 'Tech Distribution AG',
    contactPerson: 'Sarah Schmidt',
    email: 'sarah@techdist.de',
    phone: '+49 40 98765432',
  },
  globalSupplies: {
    id: 'SUP-003',
    name: 'Global Supplies International',
    contactPerson: 'Michael Weber',
    email: 'michael@globalsupplies.com',
    phone: '+49 89 24681357',
  },
  digitalWholesale: {
    id: 'SUP-004',
    name: 'Digital Wholesale Partners',
    contactPerson: 'Anna Fischer',
    email: 'anna@digitalwholesale.de',
    phone: '+49 211 13579246',
  },
  premiumGoods: {
    id: 'SUP-005',
    name: 'Premium Goods Trading',
    contactPerson: 'Jan Meyer',
    email: 'jan@premiumgoods.de',
    phone: '+49 69 36925814',
  },
} as const;
