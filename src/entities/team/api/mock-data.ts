// src/entities/team/api/mock-data.ts
import { faker } from '@faker-js/faker/locale/de';

import type { Address, CreateTeamMember, TeamMember } from '../model/schema';

// Setze Seed für konsistente Daten
faker.seed(123);

/**
 * Generiert eine realistische deutsche Adresse
 */
const generateAddress = (): Address => ({
  street: `${faker.location.streetAddress()}`,
  city: faker.location.city(),
  postalCode: faker.location.zipCode('######'),
  country: 'Deutschland',
});

/**
 * Definiere realistische Rollen pro Abteilung
 */
const rolesByDepartment: Record<string, Array<string>> = {
  engineering: [
    'Senior Full-Stack Entwickler',
    'Frontend Entwickler',
    'Backend Entwickler',
    'DevOps Engineer',
    'Tech Lead',
    'Software Architekt',
    'QA Engineer',
    'Junior Entwickler',
  ],
  design: [
    'UI/UX Designer',
    'Product Designer',
    'Design Lead',
    'UX Researcher',
    'Visual Designer',
    'Motion Designer',
  ],
  marketing: [
    'Marketing Manager',
    'Content Strategist',
    'SEO Specialist',
    'Social Media Manager',
    'Brand Manager',
    'Growth Hacker',
  ],
  sales: [
    'Sales Manager',
    'Account Executive',
    'Business Development Manager',
    'Sales Representative',
    'Key Account Manager',
    'Sales Director',
  ],
  hr: [
    'HR Manager',
    'Talent Acquisition Specialist',
    'HR Business Partner',
    'People Operations Manager',
    'Recruiter',
    'Compensation & Benefits Specialist',
  ],
  finance: [
    'Finance Manager',
    'Senior Controller',
    'Financial Analyst',
    'Accountant',
    'Treasury Analyst',
    'CFO',
  ],
  operations: [
    'Operations Manager',
    'Project Manager',
    'Scrum Master',
    'Product Owner',
    'Process Manager',
    'Supply Chain Manager',
  ],
};

const departments = Object.keys(rolesByDepartment);

/**
 * Generiert ein einzelnes Teammitglied mit Faker
 */
export const generateTeamMember = (overrides?: Partial<CreateTeamMember>): TeamMember => {
  const firstName = overrides?.firstName || faker.person.firstName();
  const lastName = overrides?.lastName || faker.person.lastName();
  const department = overrides?.department || faker.helpers.arrayElement(departments);
  const role = overrides?.role || faker.helpers.arrayElement(rolesByDepartment[department]);

  // Realistische Wahrscheinlichkeiten
  const hasPhone = faker.datatype.boolean({ probability: 0.85 });
  const hasBio = faker.datatype.boolean({ probability: 0.7 });
  const hasBirthDate = faker.datatype.boolean({ probability: 0.6 });
  const hasAddress = faker.datatype.boolean({ probability: 0.8 });
  const isRemote = faker.datatype.boolean({ probability: 0.4 });
  const hasNewsletter = faker.datatype.boolean({ probability: 0.65 });

  // Status-Verteilung: 80% aktiv, 10% inaktiv, 10% Urlaub
  const statusRandom = faker.number.float({ min: 0, max: 1 });
  const status = statusRandom < 0.8 ? 'active' : statusRandom < 0.9 ? 'inactive' : 'vacation';

  const teamMember: TeamMember = {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email:
      overrides?.email ||
      faker.internet.email({
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        provider: 'company.de',
      }),
    phone: hasPhone ? faker.phone.number({ style: 'international' }) : undefined,
    role,
    department,
    status: overrides?.status || status,
    bio: hasBio ? faker.lorem.paragraph({ min: 2, max: 4 }) : undefined,
    birthDate: hasBirthDate ? faker.date.birthdate({ min: 25, max: 60, mode: 'age' }) : undefined,
    startDate:
      overrides?.startDate ||
      faker.date.between({
        from: '2010-01-01',
        to: new Date(),
      }),
    address: hasAddress ? generateAddress() : undefined,
    newsletter: hasNewsletter,
    remoteWork: isRemote,
    locationId: faker.datatype.boolean({ probability: 0.9 })
      ? faker.helpers.arrayElement([
          'loc-berlin',
          'loc-munich',
          'loc-hamburg',
          'loc-cologne',
          'loc-frankfurt',
        ])
      : undefined,
    ...overrides,
  };

  return teamMember;
};

/**
 * Generiert mehrere Teammitglieder
 */
export const generateTeamMembers = (
  count: number,
  overrides?: Partial<CreateTeamMember>,
): Array<TeamMember> => Array.from({ length: count }, () => generateTeamMember(overrides));

/**
 * Generiert Teammitglieder für eine spezifische Abteilung
 */
export const generateTeamByDepartment = (department: string, count: number): Array<TeamMember> =>
  generateTeamMembers(count, { department });

/**
 * Generiert ein realistisches Team mit Hierarchie
 */
export const generateFullTeam = (totalCount: number = 250): Array<TeamMember> => {
  const teamMembers: Array<TeamMember> = [];

  // CEO
  teamMembers.push(
    generateTeamMember({
      firstName: 'Maximilian',
      lastName: 'Schmidt',
      email: 'max.schmidt@company.de',
      role: 'Chief Executive Officer',
      department: 'operations',
      status: 'active',
      startDate: new Date('2010-01-15'),
      remoteWork: false,
    }),
  );

  // C-Level für jede Abteilung
  const cLevelTitles: Record<string, string> = {
    engineering: 'Chief Technology Officer',
    finance: 'Chief Financial Officer',
    operations: 'Chief Operating Officer',
    marketing: 'Chief Marketing Officer',
    sales: 'Chief Sales Officer',
    hr: 'Chief People Officer',
    design: 'Chief Design Officer',
  };

  // Füge C-Level hinzu
  Object.entries(cLevelTitles).forEach(([dept, title]) => {
    teamMembers.push(
      generateTeamMember({
        role: title,
        department: dept,
        status: 'active',
        startDate: faker.date.between({ from: '2010-01-01', to: '2015-01-01' }),
        remoteWork: false,
      }),
    );
  });

  // Berechne Mitarbeiter pro Abteilung (mit realistischer Verteilung)
  const remainingCount = totalCount - teamMembers.length;
  const distribution = {
    engineering: Math.floor(remainingCount * 0.35), // 35% Entwicklung
    sales: Math.floor(remainingCount * 0.2), // 20% Vertrieb
    operations: Math.floor(remainingCount * 0.15), // 15% Operations
    marketing: Math.floor(remainingCount * 0.1), // 10% Marketing
    finance: Math.floor(remainingCount * 0.08), // 8% Finanzen
    hr: Math.floor(remainingCount * 0.07), // 7% Personal
    design: Math.floor(remainingCount * 0.05), // 5% Design
  };

  // Generiere Mitarbeiter pro Abteilung
  Object.entries(distribution).forEach(([dept, count]) => {
    for (let i = 0; i < count; i++) {
      teamMembers.push(generateTeamMember({ department: dept }));
    }
  });

  // Fülle auf die Zielzahl auf
  while (teamMembers.length < totalCount) {
    teamMembers.push(generateTeamMember());
  }

  return teamMembers.slice(0, totalCount);
};

/**
 * Vordefinierte Beispiel-Teammitglieder (Kompatibilität mit altem Code)
 */
export const mockTeamMembers = {
  // CEO
  ceo: generateTeamMember({
    firstName: 'Maximilian',
    lastName: 'Schmidt',
    email: 'max.schmidt@company.de',
    role: 'Geschäftsführer',
    department: 'operations',
    status: 'active',
    bio: 'Maximilian ist seit 2015 Geschäftsführer und verantwortet die strategische Ausrichtung des Unternehmens.',
    startDate: new Date(2015, 2, 1),
    remoteWork: false,
  }),

  // CTO
  cto: generateTeamMember({
    firstName: 'Sarah',
    lastName: 'Weber',
    email: 'sarah.weber@company.de',
    role: 'CTO',
    department: 'engineering',
    status: 'active',
    bio: 'Sarah leitet die technische Entwicklung und treibt die digitale Transformation voran.',
    startDate: new Date(2018, 5, 1),
    remoteWork: true,
  }),

  // Senior Developer
  seniorDev: generateTeamMember({
    firstName: 'Jonas',
    lastName: 'Fischer',
    email: 'jonas.fischer@company.de',
    role: 'Senior Entwickler',
    department: 'engineering',
    status: 'active',
    bio: 'Jonas ist Experte für React und Node.js mit über 8 Jahren Erfahrung.',
    startDate: new Date(2019, 8, 1),
    remoteWork: true,
  }),

  // HR Manager
  hrManager: generateTeamMember({
    firstName: 'Anna',
    lastName: 'Klein',
    email: 'anna.klein@company.de',
    role: 'HR Managerin',
    department: 'hr',
    status: 'active',
    bio: 'Anna kümmert sich um alle Belange rund um unsere Mitarbeiter und die Unternehmenskultur.',
    startDate: new Date(2020, 0, 15),
    remoteWork: false,
  }),

  // Designer
  designer: generateTeamMember({
    firstName: 'Tom',
    lastName: 'Müller',
    email: 'tom.mueller@company.de',
    role: 'UI/UX Designer',
    department: 'design',
    status: 'vacation',
    bio: 'Tom gestaltet intuitive und ansprechende Benutzeroberflächen für unsere Produkte.',
    startDate: new Date(2021, 3, 1),
    remoteWork: true,
  }),

  // Batch generators (Kompatibilität)
  generateDevelopers: (count: number) => generateTeamByDepartment('engineering', count),
  generateDesigners: (count: number) => generateTeamByDepartment('design', count),
  generateSales: (count: number) => generateTeamByDepartment('sales', count),
  generateAll: generateFullTeam,
};

/**
 * Vordefinierte Teams für spezielle Zwecke
 */
export const mockTeamPresets = {
  // Kleines Startup-Team (10 Personen)
  startup: () => generateFullTeam(10),

  // Mittleres Unternehmen (50 Personen)
  medium: () => generateFullTeam(50),

  // Großes Unternehmen (250 Personen)
  large: () => generateFullTeam(250),

  // Entwicklungsteam
  devTeam: (count: number = 20) => generateTeamMembers(count, { department: 'engineering' }),

  // Remote-Team
  remoteTeam: (count: number = 30) => generateTeamMembers(count, { remoteWork: true }),
};
