// src/entities/article/model/labels.ts
import { createValidatedLabels } from '~/shared/types/label-validation';

import type { Article } from './schema';

/**
 * Type-safe Article Labels
 */
export const articleLabels = createValidatedLabels<Article, 'actions'>({
  id: 'ID',
  articleNumber: 'Artikelnummer',
  name: 'Name',
  description: 'Beschreibung',
  price: 'Preis',
  purchasePrice: 'Einkaufspreis',
  stock: 'Lagerbestand',
  minStock: 'Mindestbestand',
  maxStock: 'Maximalbestand',
  category: 'Kategorie',
  subcategory: 'Unterkategorie',
  tags: 'Tags',
  status: 'Status',
  dimensions: 'Abmessungen',
  ean: 'EAN',
  manufacturer: 'Hersteller',
  supplier: 'Lieferant',
  createdAt: 'Erstellt am',
  updatedAt: 'Aktualisiert am',
  availableFrom: 'Verfügbar ab',
  availableUntil: 'Verfügbar bis',
  taxRate: 'Steuersatz',
  unit: 'Einheit',
  isDigital: 'Digitales Produkt',
  imageUrl: 'Bild-URL',
  thumbnailUrl: 'Vorschaubild-URL',

  // Virtual fields
  actions: 'Aktionen',
});
