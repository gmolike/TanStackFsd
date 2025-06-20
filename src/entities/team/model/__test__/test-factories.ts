import { createTestFactory, createTestDate } from '~/shared/test/utils';
import type { TeamMember, Address } from '../schema';

// Generische Factory für Address
export const createAddressFactory = createTestFactory<Address>({
  street: 'Teststraße 123',
  city: 'Berlin',
  country: 'Deutschland',
  postalCode: '10115',
});

// Generische Factory für TeamMember mit ID-Generator
let teamMemberId = 1;
export const createTeamMemberFactory = createTestFactory<TeamMember>(
  {
    id: '1',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'test@example.com',
    phone: '+49 123 456789',
    role: 'Developer',
    department: 'Engineering',
    status: 'active',
    bio: 'Experienced developer with passion for clean code',
    birthDate: createTestDate('1990-01-01'),
    startDate: createTestDate('2020-01-01'),
    address: createAddressFactory(),
    newsletter: false,
    remoteWork: false,
    locationId: 'berlin-hq',
  },
  {
    id: () => `team-${teamMemberId++}`,
    email: () => `user${teamMemberId}@example.com`,
  },
);
