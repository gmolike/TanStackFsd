/**
 * Zentrale Options-Konfiguration für Select/Combobox-Felder
 * @module shared/config/options
 */

export type Option<T = string> = {
  value: T;
  label: string;
  disabled?: boolean;
  description?: string;
};

// Base options that are used across multiple entities
export const baseOptions = {
  // Status options - used in many contexts
  status: {
    active: { value: 'active', label: 'Aktiv' },
    inactive: { value: 'inactive', label: 'Inaktiv' },
    pending: { value: 'pending', label: 'Ausstehend' },
    archived: { value: 'archived', label: 'Archiviert' },
  },

  // Country options
  country: {
    de: { value: 'de', label: 'Deutschland' },
    us: { value: 'us', label: 'Vereinigte Staaten' },
    uk: { value: 'uk', label: 'Vereinigtes Königreich' },
    fr: { value: 'fr', label: 'Frankreich' },
    jp: { value: 'jp', label: 'Japan' },
  },

  // Common boolean options
  boolean: {
    yes: { value: 'true', label: 'Ja' },
    no: { value: 'false', label: 'Nein' },
  },
} as const;

// Helper to convert object to array for selects
export function optionsToArray<T extends Record<string, Option>>(options: T): Array<Option> {
  return Object.values(options);
}

// Helper to get specific options with filtering
export function getOptions<T extends Record<string, Option>>(
  options: T,
  filter?: (option: Option) => boolean,
): Array<Option> {
  const arr = optionsToArray(options);
  return filter ? arr.filter(filter) : arr;
}
