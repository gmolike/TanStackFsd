// src/shared/test/utils/factory-helpers.ts
/**
 * Generic factory for creating test data
 */
export function createTestFactory<T>(
  defaults: T,
  generators?: Partial<Record<keyof T, () => any>>,
) {
  return (overrides?: Partial<T>): T => {
    const generated = generators
      ? Object.entries(generators).reduce(
          (acc, [key, generator]) => ({
            ...acc,
            [key]: (generator as () => any)(),
          }),
          {} as Partial<T>,
        )
      : {};

    return {
      ...defaults,
      ...generated,
      ...overrides,
    };
  };
}

/**
 * Create multiple test items with incremental IDs
 */
export function createTestItems<T extends { id: string }>(
  factory: (overrides?: Partial<T>) => T,
  count: number,
  overridesPerItem?: (index: number) => Partial<T>,
): Array<T> {
  return Array.from({ length: count }, (_, index) =>
    factory({
      id: `test-${index + 1}`,
      ...(overridesPerItem?.(index) || {}),
    }),
  );
}
