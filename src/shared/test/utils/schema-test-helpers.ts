// src/shared/test/utils/schema-test-helpers.ts
import { z } from 'zod';
import { expectZodSuccess, expectZodError } from './zod-helpers';

/**
 * Test string field validations
 */
export function testStringField<T>(
  schema: z.ZodSchema<T>,
  fieldName: keyof T,
  config: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    validExample: string;
  },
) {
  describe(`${String(fieldName)} field`, () => {
    const createTestData = (value: string) => ({ [fieldName]: value });

    it('should accept valid value', () => {
      expectZodSuccess(schema, createTestData(config.validExample));
    });

    if (config.minLength) {
      it(`should reject values shorter than ${config.minLength}`, () => {
        const shortValue = 'x'.repeat(config.minLength - 1);
        expectZodError(schema, createTestData(shortValue));
      });
    }

    if (config.maxLength) {
      it(`should reject values longer than ${config.maxLength}`, () => {
        const longValue = 'x'.repeat(config.maxLength + 1);
        expectZodError(schema, createTestData(longValue));
      });
    }

    if (config.pattern) {
      it('should validate pattern', () => {
        expectZodError(schema, createTestData('invalid-pattern'));
      });
    }
  });
}

/**
 * Test enum field validations
 */
export function testEnumField<T>(
  schema: z.ZodSchema<T>,
  fieldName: keyof T,
  validValues: readonly string[],
  invalidValue = 'invalid-enum-value',
) {
  describe(`${String(fieldName)} field`, () => {
    it('should accept valid enum values', () => {
      validValues.forEach((value) => {
        expectZodSuccess(schema, { [fieldName]: value });
      });
    });

    it('should reject invalid enum values', () => {
      expectZodError(schema, { [fieldName]: invalidValue });
    });
  });
}
