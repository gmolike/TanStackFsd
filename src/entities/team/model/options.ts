import { baseOptions, optionsToArray } from '../../../shared/config/options';

// Team-specific status options (extending base)
export const teamStatusOptions = {
  active: { value: 'active', label: 'Aktiv' },
  inactive: { value: 'inactive', label: 'Inaktiv' },
  vacation: { value: 'vacation', label: 'Im Urlaub' },
} as const;

// Department options
export const departmentOptions = {
  engineering: { value: 'engineering', label: 'Entwicklung' },
  design: { value: 'design', label: 'Design' },
  marketing: { value: 'marketing', label: 'Marketing' },
  sales: { value: 'sales', label: 'Vertrieb' },
  hr: { value: 'hr', label: 'Personal' },
  finance: { value: 'finance', label: 'Finanzen' },
  operations: { value: 'operations', label: 'Betrieb' },
} as const;

// Role options
export const roleOptions = {
  developer: { value: 'developer', label: 'Entwickler' },
  designer: { value: 'designer', label: 'Designer' },
  manager: { value: 'manager', label: 'Manager' },
  analyst: { value: 'analyst', label: 'Analyst' },
  consultant: { value: 'consultant', label: 'Berater' },
  intern: { value: 'intern', label: 'Praktikant' },
} as const;

// Framework options
export const frameworkOptions = {
  react: { value: 'react', label: 'React' },
  vue: { value: 'vue', label: 'Vue.js' },
  angular: { value: 'angular', label: 'Angular' },
  svelte: { value: 'svelte', label: 'Svelte' },
  next: { value: 'next', label: 'Next.js' },
  nuxt: { value: 'nuxt', label: 'Nuxt.js' },
  remix: { value: 'remix', label: 'Remix' },
} as const;

// Export all team options as arrays (für direkte Verwendung in Selects)
export const countryOptions = optionsToArray(baseOptions.country);
export const statusOptions = optionsToArray(teamStatusOptions);
export const departmentOptionsList = optionsToArray(departmentOptions);
export const roleOptionsList = optionsToArray(roleOptions);
export const frameworkOptionsList = optionsToArray(frameworkOptions);

// Type exports
export type TeamStatus = keyof typeof teamStatusOptions;
export type Department = keyof typeof departmentOptions;
export type Role = keyof typeof roleOptions;
export type Framework = keyof typeof frameworkOptions;
export type Country = keyof typeof baseOptions.country;
