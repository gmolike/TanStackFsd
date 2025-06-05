// src/entities/article/model/labels.ts

/**
 * Deutsche Labels für alle Article-Felder
 * Folgt dem gleichen Muster wie team/model/labels.ts
 */

// Basis-Labels die in mehreren Entities verwendet werden können
export const articleBaseLabels = {
  id: 'ID',
  name: 'Name',
  description: 'Beschreibung',
  createdAt: 'Erstellt am',
  updatedAt: 'Aktualisiert am',
  status: 'Status',
  price: 'Preis',
  email: 'E-Mail',
  phone: 'Telefon',
} as const;

// Article-spezifische Labels
export const articleLabels = {
  ...articleBaseLabels,

  // Artikel-Felder
  articleNumber: 'Artikelnummer',
  purchasePrice: 'Einkaufspreis',
  stock: 'Lagerbestand',
  minStock: 'Mindestbestand',
  maxStock: 'Maximalbestand',
  category: 'Kategorie',
  subcategory: 'Unterkategorie',
  tags: 'Tags',
  ean: 'EAN',
  manufacturer: 'Hersteller',
  taxRate: 'Steuersatz',
  unit: 'Einheit',
  isDigital: 'Digitales Produkt',
  imageUrl: 'Bild-URL',
  thumbnailUrl: 'Vorschaubild-URL',
  availableFrom: 'Verfügbar ab',
  availableUntil: 'Verfügbar bis',

  // Dimensions nested labels
  dimensions: 'Abmessungen',
  'dimensions.length': 'Länge',
  'dimensions.width': 'Breite',
  'dimensions.height': 'Höhe',
  'dimensions.weight': 'Gewicht',
  'dimensions.unit': 'Maßeinheit',

  // Supplier nested labels
  supplier: 'Lieferant',
  'supplier.id': 'Lieferanten-ID',
  'supplier.name': 'Lieferantenname',
  'supplier.contactPerson': 'Ansprechpartner',
  'supplier.email': 'Lieferanten E-Mail',
  'supplier.phone': 'Lieferanten Telefon',
} as const;

// Type für Label-Keys
export type ArticleLabelKey = keyof typeof articleLabels;

// Helper für spezifische Label-Gruppen
export const articleDimensionsLabels = {
  length: articleLabels['dimensions.length'],
  width: articleLabels['dimensions.width'],
  height: articleLabels['dimensions.height'],
  weight: articleLabels['dimensions.weight'],
  unit: articleLabels['dimensions.unit'],
} as const;

export const articleSupplierLabels = {
  id: articleLabels['supplier.id'],
  name: articleLabels['supplier.name'],
  contactPerson: articleLabels['supplier.contactPerson'],
  email: articleLabels['supplier.email'],
  phone: articleLabels['supplier.phone'],
} as const;

// Helper-Funktion zum Abrufen von Labels
export const getArticleLabel = (key: ArticleLabelKey): string => articleLabels[key] || key;

// Label-Gruppen für Formulare
export const articleFormSections = {
  basic: {
    title: 'Grundinformationen',
    fields: ['articleNumber', 'name', 'description'] as const,
  },
  pricing: {
    title: 'Preise',
    fields: ['price', 'purchasePrice', 'taxRate'] as const,
  },
  inventory: {
    title: 'Lagerbestand',
    fields: ['stock', 'minStock', 'maxStock', 'unit'] as const,
  },
  categorization: {
    title: 'Kategorisierung',
    fields: ['category', 'subcategory', 'tags'] as const,
  },
  physical: {
    title: 'Physische Eigenschaften',
    fields: ['dimensions', 'ean', 'manufacturer', 'isDigital'] as const,
  },
  supplier: {
    title: 'Lieferanteninformationen',
    fields: ['supplier'] as const,
  },
  availability: {
    title: 'Verfügbarkeit',
    fields: ['status', 'availableFrom', 'availableUntil'] as const,
  },
  media: {
    title: 'Medien',
    fields: ['imageUrl', 'thumbnailUrl'] as const,
  },
} as const;
