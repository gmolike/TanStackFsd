// src/shared/test/utils/label-test-helpers.ts
/**
 * Test label definitions for completeness and translations
 */
export function testLabels<T extends Record<string, any>>(
  labels: Record<keyof T, string>,
  config: {
    requiredFields: Array<keyof T>;
    translations?: Partial<Record<keyof T, string>>;
  },
) {
  describe('Label Definitions', () => {
    it('should contain all required fields', () => {
      config.requiredFields.forEach((field) => {
        expect(labels[field]).toBeDefined();
        expect(typeof labels[field]).toBe('string');
        expect(labels[field].length).toBeGreaterThan(0);
      });
    });

    if (config.translations) {
      it('should have correct translations', () => {
        Object.entries(config.translations).forEach(([field, expectedTranslation]) => {
          expect(labels[field as keyof T]).toBe(expectedTranslation);
        });
      });
    }
  });
}

/**
 * Test nested label structures
 */
export function testNestedLabels(
  labels: Record<string, any>,
  path: Array<string>,
  expectedValue: string,
) {
  const value = path.reduce((obj, key) => obj?.[key], labels);
  expect(value).toBe(expectedValue);
}
