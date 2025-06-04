// src/entities/team-member/model/schema.ts
import { z } from 'zod';

// ===== SUB-SCHEMAS =====
export const addressSchema = z.object({
  street: z.string().min(1, 'Straße ist erforderlich'),
  city: z.string().min(1, 'Stadt ist erforderlich'),
  country: z.string().min(1, 'Land ist erforderlich'),
  postalCode: z.string().optional(),
});

// ===== MAIN SCHEMA =====
export const teamMemberSchema = z.object({
  // Basic fields
  id: z.string(),
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]+$/, 'Ungültige Telefonnummer')
    .optional(),

  // Professional info
  role: z.string().min(1, 'Rolle ist erforderlich'),
  department: z.string().min(1, 'Abteilung ist erforderlich'),
  status: z.enum(['active', 'inactive', 'vacation'], {
    errorMap: () => ({ message: 'Ungültiger Status' }),
  }),

  // Personal info
  bio: z
    .string()
    .min(10, 'Biografie muss mindestens 10 Zeichen lang sein')
    .max(500, 'Biografie darf maximal 500 Zeichen lang sein')
    .optional(),

  // Date fields
  birthDate: z
    .date({
      required_error: 'Geburtsdatum ist erforderlich',
      invalid_type_error: 'Ungültiges Datum',
    })
    .optional(),

  startDate: z.date({
    required_error: 'Eintrittsdatum ist erforderlich',
    invalid_type_error: 'Ungültiges Datum',
  }),

  // Address
  address: addressSchema.optional(),

  // Preferences
  newsletter: z.boolean().default(false),
  remoteWork: z.boolean().default(false),
});

// ===== TYPES =====
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type Address = z.infer<typeof addressSchema>;

// ===== CREATE/UPDATE SCHEMAS =====
export const createTeamMemberSchema = teamMemberSchema.omit({ id: true });
export const updateTeamMemberSchema = teamMemberSchema.partial().required({ id: true });

export type CreateTeamMember = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMember = z.infer<typeof updateTeamMemberSchema>;
