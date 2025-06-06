// src/entities/location/model/schema.ts
import { z } from 'zod';

// ===== SUB-SCHEMAS =====

// Wiederverwendung von Address aus team
export const addressSchema = z.object({
  street: z.string().min(1, 'Straße ist erforderlich'),
  city: z.string().min(1, 'Stadt ist erforderlich'),
  country: z.string().min(1, 'Land ist erforderlich'),
  postalCode: z.string().optional(),
});

// Öffnungszeiten Schema
export const operatingHoursSchema = z.object({
  monday: z.object({ open: z.string(), close: z.string() }).optional(),
  tuesday: z.object({ open: z.string(), close: z.string() }).optional(),
  wednesday: z.object({ open: z.string(), close: z.string() }).optional(),
  thursday: z.object({ open: z.string(), close: z.string() }).optional(),
  friday: z.object({ open: z.string(), close: z.string() }).optional(),
  saturday: z.object({ open: z.string(), close: z.string() }).optional(),
  sunday: z.object({ open: z.string(), close: z.string() }).optional(),
});

// ===== MAIN SCHEMAS =====

// Standort Schema
export const locationSchema = z.object({
  // Basis-Felder
  id: z.string(),
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  code: z
    .string()
    .min(3, 'Code muss mindestens 3 Zeichen lang sein')
    .regex(/^[A-Z0-9-]+$/, 'Code darf nur Großbuchstaben, Zahlen und Bindestriche enthalten'),
  type: z.enum(['warehouse', 'office', 'store', 'production'], {
    errorMap: () => ({ message: 'Ungültiger Standorttyp' }),
  }),
  status: z
    .enum(['active', 'inactive', 'maintenance'], {
      errorMap: () => ({ message: 'Ungültiger Status' }),
    })
    .default('active'),

  // Adresse
  address: addressSchema,

  // Verantwortlicher
  managerId: z.string().optional(),

  // Zusätzliche Informationen
  description: z
    .string()
    .min(10, 'Beschreibung muss mindestens 10 Zeichen lang sein')
    .max(500, 'Beschreibung darf maximal 500 Zeichen lang sein')
    .optional(),
  capacity: z.number().positive('Kapazität muss positiv sein').optional(),
  capacityUnit: z.enum(['sqm', 'pallets', 'units']).optional(),
  operatingHours: operatingHoursSchema.optional(),

  // Meta-Daten
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

// Lagerbestand Schema
export const locationInventorySchema = z.object({
  id: z.string(),
  locationId: z.string(),
  articleId: z.string(),

  // Bestandsinformationen
  stock: z
    .number()
    .int('Bestand muss eine ganze Zahl sein')
    .min(0, 'Bestand kann nicht negativ sein'),
  reservedStock: z
    .number()
    .int('Reservierter Bestand muss eine ganze Zahl sein')
    .min(0, 'Reservierter Bestand kann nicht negativ sein')
    .default(0),
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

  // Lagerplatz
  storageLocation: z.string().optional(), // z.B. "A-12-3"

  // Inventur
  lastInventoryDate: z.date().optional(),
  lastInventoryBy: z.string().optional(), // User ID

  // Meta-Daten
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

// ===== TYPES =====
export type Location = z.infer<typeof locationSchema>;
export type Address = z.infer<typeof addressSchema>;
export type OperatingHours = z.infer<typeof operatingHoursSchema>;
export type LocationInventory = z.infer<typeof locationInventorySchema>;

// ===== CREATE/UPDATE SCHEMAS =====
export const createLocationSchema = locationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLocationSchema = locationSchema
  .partial()
  .required({ id: true })
  .extend({
    updatedAt: z.date().default(() => new Date()),
  });

export const createLocationInventorySchema = locationInventorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLocationInventorySchema = locationInventorySchema
  .partial()
  .required({ id: true })
  .extend({
    updatedAt: z.date().default(() => new Date()),
  });

export type CreateLocation = z.infer<typeof createLocationSchema>;
export type UpdateLocation = z.infer<typeof updateLocationSchema>;
export type CreateLocationInventory = z.infer<typeof createLocationInventorySchema>;
export type UpdateLocationInventory = z.infer<typeof updateLocationInventorySchema>;

// ===== FORM SCHEMAS =====
export const locationFormSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  code: z
    .string()
    .min(3, 'Code muss mindestens 3 Zeichen lang sein')
    .regex(/^[A-Z0-9-]+$/, 'Code darf nur Großbuchstaben, Zahlen und Bindestriche enthalten'),
  type: z.enum(['warehouse', 'office', 'store', 'production']),
  status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
  address: addressSchema,
  managerId: z.string().optional().default(''),
  description: z.string().optional().default(''),
  capacity: z.number().optional().nullable(),
  capacityUnit: z.enum(['sqm', 'pallets', 'units']).optional(),
  operatingHours: operatingHoursSchema.optional().nullable(),
});

export type LocationFormData = z.infer<typeof locationFormSchema>;
