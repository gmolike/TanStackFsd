// src/entities/article/model/schema.ts
import { z } from 'zod';

// ===== SUB-SCHEMAS =====
export const dimensionsSchema = z.object({
  length: z.number().positive('Länge muss positiv sein').optional(),
  width: z.number().positive('Breite muss positiv sein').optional(),
  height: z.number().positive('Höhe muss positiv sein').optional(),
  weight: z.number().positive('Gewicht muss positiv sein').optional(),
  unit: z
    .enum(['cm', 'mm', 'm'], {
      errorMap: () => ({ message: 'Ungültige Maßeinheit' }),
    })
    .default('cm'),
});

export const supplierSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Lieferantenname ist erforderlich'),
  contactPerson: z.string().optional(),
  email: z.string().email('Ungültige E-Mail-Adresse').optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]+$/, 'Ungültige Telefonnummer')
    .optional(),
});

// ===== MAIN SCHEMA =====
export const articleSchema = z.object({
  // Basic fields
  id: z.string(),
  articleNumber: z.string().min(1, 'Artikelnummer ist erforderlich'),
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  description: z
    .string()
    .min(10, 'Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(1000, 'Beschreibung darf maximal 1000 Zeichen lang sein')
    .optional(),

  // Price and stock
  price: z.number().positive('Preis muss positiv sein'),
  purchasePrice: z.number().positive('Einkaufspreis muss positiv sein').optional(),
  stock: z
    .number()
    .int('Lagerbestand muss eine ganze Zahl sein')
    .min(0, 'Lagerbestand kann nicht negativ sein'),
  minStock: z
    .number()
    .int('Mindestbestand muss eine ganze Zahl sein')
    .min(0, 'Mindestbestand kann nicht negativ sein')
    .default(0),
  maxStock: z
    .number()
    .int('Maximalbestand muss eine ganze Zahl sein')
    .positive('Maximalbestand muss positiv sein')
    .optional(),

  // Categories and tags
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).default([]),

  // Status
  status: z
    .enum(['available', 'unavailable', 'discontinued', 'coming_soon'], {
      errorMap: () => ({ message: 'Ungültiger Status' }),
    })
    .default('available'),

  // Physical properties
  dimensions: dimensionsSchema.optional(),
  ean: z
    .string()
    .regex(/^[0-9]{13}$/, 'EAN muss 13 Ziffern haben')
    .optional(),
  manufacturer: z.string().optional(),

  // Supplier
  supplier: supplierSchema.optional(),

  // Dates
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
  availableFrom: z.date().optional(),
  availableUntil: z.date().optional(),

  // Additional fields
  taxRate: z
    .number()
    .min(0, 'Steuersatz kann nicht negativ sein')
    .max(100, 'Steuersatz kann nicht über 100% sein')
    .default(19),
  unit: z.string().default('Stück'),
  isDigital: z.boolean().default(false),
  imageUrl: z.string().url('Ungültige URL').optional(),
  thumbnailUrl: z.string().url('Ungültige URL').optional(),
});

// ===== TYPES =====
export type Article = z.infer<typeof articleSchema>;
export type Dimensions = z.infer<typeof dimensionsSchema>;
export type Supplier = z.infer<typeof supplierSchema>;

// ===== CREATE/UPDATE SCHEMAS =====
export const createArticleSchema = articleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateArticleSchema = articleSchema
  .partial()
  .required({ id: true })
  .extend({
    updatedAt: z.date().default(() => new Date()),
  });

export type CreateArticle = z.infer<typeof createArticleSchema>;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;
