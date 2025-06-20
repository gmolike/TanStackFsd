// src/shared/test/utils/zod-helpers.ts
import { expect } from 'vitest';
import type { z } from 'zod';

/**
 * Generic helper to test Zod validation errors
 */
export function expectZodError<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  expectedMessage?: string | RegExp,
) {
  const result = schema.safeParse(data);
  expect(result.success).toBe(false);

  if (!result.success && expectedMessage) {
    const errorMessages = result.error.issues.map((issue) => issue.message);
    if (typeof expectedMessage === 'string') {
      expect(errorMessages).toContain(expectedMessage);
    } else {
      expect(errorMessages.some((msg) => expectedMessage.test(msg))).toBe(true);
    }
  }

  return result;
}

/**
 * Generic helper to test successful Zod validation
 */
export function expectZodSuccess<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  expect(result.success).toBe(true);

  if (result.success) {
    return result.data;
  }

  throw new Error('Schema validation failed unexpectedly');
}

/**
 * Test multiple invalid cases at once
 */
export function testInvalidCases<T>(
  schema: z.ZodSchema<T>,
  cases: Array<{ data: unknown; error?: string | RegExp; description: string }>,
) {
  cases.forEach(({ data, error, description }) => {
    it(`should reject ${description}`, () => {
      expectZodError(schema, data, error);
    });
  });
}

/**
 * Test multiple valid cases at once
 */
export function testValidCases<T>(
  schema: z.ZodSchema<T>,
  cases: Array<{ data: unknown; description: string }>,
) {
  cases.forEach(({ data, description }) => {
    it(`should accept ${description}`, () => {
      expectZodSuccess(schema, data);
    });
  });
}
