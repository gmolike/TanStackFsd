// src/shared/types/__mocks__/label-validation.ts
import { vi } from 'vitest';

export const createValidatedLabels = vi.fn(
  <T extends Record<string, unknown>, TKey extends keyof T = never>(
    labels: Record<Exclude<keyof T, TKey>, string>,
  ) =>
    // Return a frozen object to simulate immutability
    Object.freeze(labels),
);
