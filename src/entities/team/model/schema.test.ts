import { describe, it } from 'vitest';
import {
  expectZodError,
  expectZodSuccess,
  testInvalidCases,
  testValidCases,
  testStringField,
  testEnumField,
  createTestDate,
} from '~/shared/test/utils';
import { addressSchema, teamMemberSchema, teamFormSchema, type TeamMember } from './schema';
import { createTeamMemberFactory } from './__test__/test-factories';

describe('Team Schemas', () => {
  describe('addressSchema', () => {
    // Nutze generische Test Cases
    testValidCases(addressSchema, [
      {
        description: 'complete address with postal code',
        data: {
          street: 'Hauptstraße 123',
          city: 'Berlin',
          country: 'Deutschland',
          postalCode: '10115',
        },
      },
      {
        description: 'address without postal code',
        data: {
          street: 'Hauptstraße 123',
          city: 'Berlin',
          country: 'Deutschland',
        },
      },
    ]);

    testInvalidCases(addressSchema, [
      {
        description: 'empty street',
        data: { street: '', city: 'Berlin', country: 'Deutschland' },
        error: 'Street is required',
      },
      {
        description: 'missing city',
        data: { street: 'Hauptstraße 123', country: 'Deutschland' },
        error: 'Required',
      },
    ]);
  });

  describe('teamMemberSchema', () => {
    const validMember = createTeamMemberFactory();

    // Test string fields mit Helper
    testStringField(teamMemberSchema, 'firstName', {
      minLength: 2,
      validExample: 'Max',
    });

    testStringField(teamMemberSchema, 'email', {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      validExample: 'test@example.com',
    });

    // Test enum field
    testEnumField(
      teamMemberSchema,
      'status',
      ['active', 'inactive', 'vacation'] as const,
      'invalid-status',
    );

    it('should validate complete team member', () => {
      expectZodSuccess(teamMemberSchema, validMember);
    });

    it('should handle nullable fields correctly', () => {
      const memberWithNulls = {
        ...validMember,
        birthDate: null,
        address: null,
        phone: '',
      };
      expectZodSuccess(teamMemberSchema, memberWithNulls);
    });
  });
});
