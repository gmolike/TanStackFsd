// src/routes/team.tsx
import { useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { Badge } from '~/shared/ui/badge';

import {
  InputShadcn as Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../shared/shadcn';

// ================= TYPES =================
type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
};

// ================= LOGIC =================
const teamRoute = createFileRoute('/team')({
  component: TeamPage,
});

function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: TeamMember['status']) => {
    const variants = {
      active: { label: 'Aktiv', variant: 'default' as const },
      inactive: { label: 'Inaktiv', variant: 'secondary' as const },
      vacation: { label: 'Urlaub', variant: 'outline' as const },
    };

    const { label, variant } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  // ================= RETURN =================
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="mt-2 text-gray-600">Übersicht aller Teammitglieder</p>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          type="search"
          placeholder="Teammitglied suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Abteilung</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.id}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell>{getStatusBadge(member.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const Route = teamRoute;
