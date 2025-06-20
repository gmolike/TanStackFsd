// src/shared/types/label-validation.ts
/**
 * Helper Type für type-safe Labels
 * Stellt sicher, dass alle Felder eines Types ein Label haben
 */

type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never;
}[keyof T];

type BaseKeys<T> = RequiredKeys<T> | OptionalKeys<T>;

export type ValidatedLabels<T, TAdditionalKeys extends string = never> = Record<
  BaseKeys<T> | TAdditionalKeys,
  string
>;

/**
 * Erstellt type-safe Labels mit Validierung
 */
export function createValidatedLabels<T, TAdditionalKeys extends string = never>(
  labels: ValidatedLabels<T, TAdditionalKeys>,
): ValidatedLabels<T, TAdditionalKeys> {
  return labels;
}
