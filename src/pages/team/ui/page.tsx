import { TeamMember } from '~/entities/team-member';
import { TeamList } from '~/widgets/team-list';

export function TeamPage() {
  // Mock data - später durch API-Call ersetzen
  const teamMembers: Array<TeamMember> = [
    {
      id: '1',
      name: 'Max Mustermann',
      email: 'max@example.com',
      role: 'Entwickler',
      department: 'IT',
      status: 'active',
    },
    {
      id: '2',
      name: 'Anna Schmidt',
      email: 'anna@example.com',
      role: 'Projektleitung',
      department: 'Management',
      status: 'active',
    },
    {
      id: '3',
      name: 'Tom Weber',
      email: 'tom@example.com',
      role: 'Designer',
      department: 'Design',
      status: 'vacation',
    },
    {
      id: '4',
      name: 'Lisa Müller',
      email: 'lisa@example.com',
      role: 'HR Manager',
      department: 'Personal',
      status: 'active',
    },
    {
      id: '5',
      name: 'Jan Meyer',
      email: 'jan@example.com',
      role: 'Backend Entwickler',
      department: 'IT',
      status: 'inactive',
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
