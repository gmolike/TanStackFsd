// src/entities/team/api/mock-data.ts

import { array, random, string } from '~/shared/mock';

import { departmentOptions, roleOptions, teamStatusOptions } from '../model/options';
import type { Address, CreateTeamMember, TeamMember } from '../model/schema';

/**
 * Generiert Mock-Daten für eine Adresse
 */
const generateAddress = (): Address => ({
  street: string.street(),
  city: string.city(),
  country: 'Deutschland',
  postalCode: string.postalCode(),
});

/**
 * Generiert ein einzelnes Teammitglied
 */
export const generateTeamMember = (overrides?: Partial<CreateTeamMember>): TeamMember => {
  const firstName = overrides?.firstName || string.firstName();
  const lastName = overrides?.lastName || string.lastName();
  const department = overrides?.department || random.arrayElement(Object.keys(departmentOptions));

  // Rolle basierend auf Abteilung
  const rolesByDepartment: Record<string, Array<string>> = {
    engineering: ['Senior Entwickler', 'Junior Entwickler', 'DevOps Engineer', 'Tech Lead'],
    design: ['UI/UX Designer', 'Product Designer', 'Design Lead', 'UX Researcher'],
    marketing: ['Marketing Manager', 'Content Creator', 'SEO Specialist', 'Social Media Manager'],
    sales: ['Sales Manager', 'Account Executive', 'Business Developer', 'Sales Representative'],
    hr: ['HR Manager', 'Recruiter', 'HR Business Partner', 'People Operations'],
    finance: ['Finance Manager', 'Controller', 'Accountant', 'Financial Analyst'],
    operations: ['Operations Manager', 'Project Manager', 'Scrum Master', 'Product Owner'],
  };

  const role =
    overrides?.role || random.arrayElement(rolesByDepartment[department] || ['Mitarbeiter']);

  const teamMember: TeamMember = {
    id: random.uuid(),
    firstName,
    lastName,
    email: overrides?.email || string.email(firstName, lastName),
    phone: random.boolean(0.8) ? string.phone() : undefined,
    role,
    department: random.arrayElement(Object.values(departmentOptions)).value,
    status: random.arrayElement(Object.keys(teamStatusOptions)) as keyof typeof teamStatusOptions,
    bio: random.boolean(0.6)
      ? `${firstName} ist ${role} in der Abteilung ${department}. ${string.lorem(20)}.`
      : undefined,
    birthDate: random.boolean(0.4)
      ? random.date(new Date(1960, 0, 1), new Date(2000, 11, 31))
      : undefined,
    startDate: random.date(new Date(2018, 0, 1), new Date()),
    address: random.boolean(0.7) ? generateAddress() : undefined,
    newsletter: random.boolean(0.6),
    remoteWork: random.boolean(0.4),
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
): Array<TeamMember> => array.of(count, () => generateTeamMember(overrides));

/**
 * Generiert Teammitglieder für eine spezifische Abteilung
 */
export const generateTeamByDepartment = (department: string, count: number): Array<TeamMember> =>
  generateTeamMembers(count, { department });

/**
 * Generiert ein komplettes Team mit verschiedenen Abteilungen
 */
export const generateFullTeam = (totalCount: number = 30): Array<TeamMember> => {
  const departments = Object.values(departmentOptions).map((opt) => opt.value);
  const teamMembers: Array<TeamMember> = [];

  // Verteile Mitglieder auf Abteilungen
  const perDepartment = Math.floor(totalCount / departments.length);
  const remainder = totalCount % departments.length;

  departments.forEach((department, index) => {
    const count = perDepartment + (index < remainder ? 1 : 0);

    // Stelle sicher, dass jede Abteilung einen Manager hat
    if (count > 0) {
      teamMembers.push(
        generateTeamMember({
          department,
          role: `${department} Manager`,
          status: 'active',
        }),
      );

      // Füge weitere Mitglieder hinzu
      if (count > 1) {
        teamMembers.push(...generateTeamByDepartment(department, count - 1));
      }
    }
  });

  return teamMembers;
};

/**
 * Vordefinierte Beispiel-Teammitglieder
 */
export const mockTeamMembers = {
  // CEO
  ceo: generateTeamMember({
    firstName: 'Maximilian',
    lastName: 'Schneider',
    email: 'max.schneider@company.de',
    role: 'Geschäftsführer',
    department: 'Management',
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
    department: 'Entwicklung',
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
    department: 'Entwicklung',
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
    department: 'Personal',
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
    department: 'Design',
    status: 'vacation',
    bio: 'Tom gestaltet intuitive und ansprechende Benutzeroberflächen für unsere Produkte.',
    startDate: new Date(2021, 3, 1),
    remoteWork: true,
  }),

  // Batch generators
  generateDevelopers: (count: number) => generateTeamByDepartment('Entwicklung', count),
  generateDesigners: (count: number) => generateTeamByDepartment('Design', count),
  generateSales: (count: number) => generateTeamByDepartment('Vertrieb', count),
  generateAll: generateFullTeam,
};
