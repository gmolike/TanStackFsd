// src/pages/team/list/ui/page.tsx
import { TeamList } from '~/widgets/team-list';

import type { TeamMember } from '~/entities/team-member';

export function TeamListPage() {
  // Mock data - später durch API-Call ersetzen
  const teamMembers: Array<TeamMember> = [
    {
      id: '1',
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      phone: '+49 123 456789',
      role: 'Senior Entwickler',
      department: 'IT',
      status: 'active',
      startDate: new Date('2020-03-15'),
      newsletter: true,
      remoteWork: true,
    },
    {
      id: '2',
      firstName: 'Anna',
      lastName: 'Schmidt',
      email: 'anna@example.com',
      phone: '+49 234 567890',
      role: 'Projektleiterin',
      department: 'Management',
      status: 'active',
      startDate: new Date('2018-06-01'),
      newsletter: false,
      remoteWork: false,
    },
    {
      id: '3',
      firstName: 'Tom',
      lastName: 'Weber',
      email: 'tom@example.com',
      role: 'UI/UX Designer',
      department: 'Design',
      status: 'vacation',
      startDate: new Date('2021-09-01'),
      newsletter: true,
      remoteWork: true,
    },
    {
      id: '4',
      firstName: 'Lisa',
      lastName: 'Müller',
      email: 'lisa@example.com',
      phone: '+49 345 678901',
      role: 'HR Managerin',
      department: 'Personal',
      status: 'active',
      startDate: new Date('2019-01-15'),
      newsletter: true,
      remoteWork: false,
    },
    {
      id: '5',
      firstName: 'Jan',
      lastName: 'Meyer',
      email: 'jan@example.com',
      role: 'Backend Entwickler',
      department: 'IT',
      status: 'inactive',
      startDate: new Date('2022-04-01'),
      newsletter: false,
      remoteWork: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="mt-2 text-gray-600">Übersicht aller Teammitglieder</p>
      </div>

      <TeamList teamMembers={teamMembers} />
    </div>
  );
}
