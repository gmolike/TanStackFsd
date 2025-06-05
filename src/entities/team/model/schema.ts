// src/entities/team/model/schema.ts
import { z } from 'zod';

// ===== SUB-SCHEMAS =====
export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().optional(),
});

// Simplified team member for form array (used in the complex teamFormSchema)
export const teamMemberFormItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().optional(),
});

// Full team member schema
export const teamMemberSchema = z.object({
  // Basic fields
  id: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]+$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),

  // Professional info
  role: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
  status: z.enum(['active', 'inactive', 'vacation'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }),

  // Personal info
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  // Date fields
  birthDate: z
    .date({
      required_error: 'Birth date is required',
      invalid_type_error: 'Invalid date',
    })
    .optional()
    .nullable(),

  startDate: z.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Invalid date',
  }),

  // Address
  address: addressSchema.optional().nullable(),

  // Preferences
  newsletter: z.boolean().default(false),
  remoteWork: z.boolean().default(false),
});

// Complex form schema (for the test form page)
export const teamFormSchema = z
  .object({
    // Basic fields
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .regex(/^\+?[0-9\s-]+$/, 'Invalid phone number')
      .optional(),

    // TextArea
    bio: z
      .string()
      .min(10, 'Bio must be at least 10 characters')
      .max(500, 'Bio must be less than 500 characters'),

    // Select & Combobox
    country: z.string().min(1, 'Please select a country'),
    framework: z.string().min(1, 'Please select a framework'),

    // Checkbox
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
    newsletter: z.boolean().optional(),

    // Date fields
    birthDate: z.date({
      required_error: 'Birth date is required',
      invalid_type_error: 'Invalid date',
    }),

    // Date range
    projectStartDate: z.date().optional(),
    projectEndDate: z.date().optional(),

    // Complex object from dialog
    address: addressSchema,

    // Field array with simplified schema for form
    teamMembers: z.array(teamMemberFormItemSchema).min(1, 'At least one team member is required'),
  })
  .refine(
    (data) => {
      if (data.projectStartDate && data.projectEndDate) {
        return data.projectEndDate >= data.projectStartDate;
      }
      return true;
    },
    {
      message: 'Project end date must be after or equal to start date',
      path: ['projectEndDate'],
    },
  )
  .refine((data) => data.teamMembers.some((member) => member.role && member.role.trim() !== ''), {
    message: 'At least one team member must have a role specified',
    path: ['teamMembers'],
  })
  .refine(
    (data) => {
      const emails = data.teamMembers.map((member) => member.email.toLowerCase());
      const uniqueEmails = new Set(emails);
      return emails.length === uniqueEmails.size;
    },
    {
      message: 'Team member emails must be unique',
      path: ['teamMembers'],
    },
  );

export type TeamFormData = z.infer<typeof teamFormSchema>;

// ===== TEAM MEMBER TYPES =====
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type Address = z.infer<typeof addressSchema>;

// ===== CREATE/UPDATE SCHEMAS =====
export const createTeamMemberSchema = teamMemberSchema.omit({ id: true });
export const updateTeamMemberSchema = teamMemberSchema.partial().required({ id: true });

export type CreateTeamMember = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMember = z.infer<typeof updateTeamMemberSchema>;

// ===== FORM SCHEMAS FOR TEAM MEMBERS =====
// Form schemas handle HTML form realities (empty strings instead of undefined)
export const teamMemberFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().default(''),
  role: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
  status: z.enum(['active', 'inactive', 'vacation']).default('active'),
  bio: z.string().optional().default(''),
  birthDate: z.date().optional().nullable(),
  startDate: z.date(),
  address: addressSchema.optional().nullable(),
  newsletter: z.boolean().default(false),
  remoteWork: z.boolean().default(false),
});

export const createTeamMemberFormSchema = teamMemberFormSchema;
export const updateTeamMemberFormSchema = teamMemberFormSchema.extend({
  id: z.string(),
});

export type TeamMemberFormData = z.infer<typeof teamMemberFormSchema>;
export type CreateTeamMemberFormData = z.infer<typeof createTeamMemberFormSchema>;
export type UpdateTeamMemberFormData = z.infer<typeof updateTeamMemberFormSchema>;
