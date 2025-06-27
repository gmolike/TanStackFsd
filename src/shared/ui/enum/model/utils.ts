/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type {
  EnumConfigBundle,
  EnumValueConfig,
  FlexibleEnumConfig,
  StrictEnumConfig,
} from './types';

/**
 * Extrahiert den Label für einen Enum-Wert aus der Config
 * Nutzt Enum-Value als Fallback wenn kein Label definiert
 */
export function getEnumLabel<T extends Record<string, string | number>>(
  value: string | number | symbol | null | undefined,
  config: StrictEnumConfig<T>,
  enumObj?: T,
  fallback = '',
): string {
  if (value === null || value === undefined) return fallback;

  const key = String(value);
  const valueConfig = config[key as keyof typeof config];

  // Priorität: 1. Expliziter Label, 2. Enum-Value, 3. Fallback
  if (valueConfig.label) {
    return valueConfig.label;
  }

  // Versuche Enum-Value zu nutzen wenn enumObj übergeben
  if (enumObj && key in enumObj) {
    return String(enumObj[key as keyof T]);
  }

  return fallback;
}

/**
 * Extrahiert die Config für einen Enum-Wert
 * Erstellt Default-Config mit Enum-Value als Label
 */
export function getEnumConfig<T extends Record<string, string | number>>(
  value: string | number | symbol | null | undefined,
  config: StrictEnumConfig<T>,
  enumObj?: T,
): EnumValueConfig | undefined {
  if (value === null || value === undefined) return undefined;

  const key = String(value);
  const valueConfig = config[key as keyof typeof config];

  // Wenn kein Label, nutze Enum-Value
  if (!valueConfig.label && enumObj && key in enumObj) {
    return {
      ...valueConfig,
      label: String(enumObj[key as keyof T]),
    };
  }

  return valueConfig;
}

/**
 * Erstellt Config nur mit Varianten - nutzt Enum-Values als Labels
 */
export function createEnumVariantConfig<T extends Record<string, string>>(
  enumObj: T,
  variantMap: FlexibleEnumConfig<T>,
): EnumConfigBundle<T> {
  const variants = {} as StrictEnumConfig<T>;

  (Object.keys(enumObj) as Array<keyof T>).forEach((key) => {
    const mapValue = variantMap[key];
    if (typeof mapValue === 'string') {
      variants[key] = { variant: mapValue };
    } else {
      variants[key] = mapValue as EnumValueConfig;
    }
  });

  return { variants, enumObj };
}

/**
 * Helper für automatische Config-Generierung aus Enum-Values
 */
export function createEnumConfigFromValues<T extends Record<string, string>>(
  enumObj: T,
  variantMap?: Partial<Record<keyof T, EnumValueConfig['variant']>>,
): StrictEnumConfig<T> {
  const config = {} as StrictEnumConfig<T>;

  (Object.keys(enumObj) as Array<keyof T>).forEach((key) => {
    config[key] = {
      // Label explizit aus Enum-Value
      label: enumObj[key],
      variant: variantMap?.[key] ?? 'default',
    };
  });

  return config;
}
