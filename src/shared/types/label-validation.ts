// shared/types/label-validation.ts
/**
 * Vereinfachtes Type-Safe Label System
 */

// Basis Type für flache Felder
type FlattenKeys<T> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Date | null | undefined
      ? K
      : K | `${string & K}.${string & keyof T[K]}`
    : K;
}[keyof T];

// Einfache Validierung: Alle DTO-Keys müssen Labels haben
export type RequiredLabels<T> = Record<FlattenKeys<T>, string>;

// Helper Type für zusätzliche Felder
export type LabelsWithExtras<T, TExtra extends string = never> = Record<
  FlattenKeys<T> | TExtra,
  string
>;

// Vereinfachte createValidatedLabels Funktion
export const createValidatedLabels = <TData, TExtra extends string = never>(
  labels: LabelsWithExtras<TData, TExtra>,
): LabelsWithExtras<TData, TExtra> => labels;
