// src/shared/types/label-validation.ts
/**
 * Helper Type für type-safe Labels
 * Stellt sicher, dass alle Felder eines Types ein Label haben
 */

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type BaseKeys<T> = RequiredKeys<T> | OptionalKeys<T>;

export type ValidatedLabels<T, AdditionalKeys extends string = never> = Record<
  BaseKeys<T> | AdditionalKeys,
  string
>;

/**
 * Erstellt type-safe Labels mit Validierung
 */
export function createValidatedLabels<T, AdditionalKeys extends string = never>(
  labels: ValidatedLabels<T, AdditionalKeys>,
): ValidatedLabels<T, AdditionalKeys> {
  return labels;
}
