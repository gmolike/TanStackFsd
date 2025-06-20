// src/entities/team/model/__tests__/labels.test.ts
import { describe, it, expect } from 'vitest';
import { testLabels, testNestedLabels } from '~/shared/test/utils';
import { teamLabels, dashboardLabels, teamInfoLabels } from './labels';
import type { TeamMember } from './schema';

describe('Team Labels', () => {
  // Nutze generische Label-Test-Helper mit korrektem Type
  testLabels<TeamMember>(teamLabels as Record<keyof TeamMember, string>, {
    requiredFields: [
      'id',
      'firstName',
      'lastName',
      'email',
      'phone',
      'role',
      'department',
      'status',
      'startDate',
    ],
    translations: {
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'E-Mail',
      department: 'Abteilung',
      birthDate: 'Geburtsdatum',
      startDate: 'Eintrittsdatum',
      remoteWork: 'Remote-Arbeit',
    },
  });

  describe('dashboardLabels', () => {
    it('should contain dashboard-specific labels', () => {
      expect(dashboardLabels.nameWithRole).toBe('Teammitglied');
      expect(dashboardLabels.contact).toBe('Kontakt');
      expect(dashboardLabels.remoteWork).toBe('Remote');
    });
  });

  describe('teamInfoLabels', () => {
    it('should contain nested address structure', () => {
      testNestedLabels(teamInfoLabels, ['address', '_title'], 'Adresse');
      testNestedLabels(teamInfoLabels, ['address', 'street'], 'Straße');
      testNestedLabels(teamInfoLabels, ['address', 'city'], 'Stadt');
      testNestedLabels(teamInfoLabels, ['address', 'postalCode'], 'Postleitzahl');
      testNestedLabels(teamInfoLabels, ['address', 'country'], 'Land');
    });
  });
});
