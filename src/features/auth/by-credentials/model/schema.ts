import { z } from 'zod';

export type LoginFormData = {
  email: string;
  password: string;
};

export const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
});
