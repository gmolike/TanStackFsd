import { useState } from 'react';

import { TeamMember } from '~/entities/team-member';
import { Badge } from '~/shared/ui/badge';
import {
  InputShadcn as Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/shared/shadcn';

interface TeamListProps {
  teamMembers: TeamMember[];
}

export function TeamList({ teamMembers }: TeamListProps) {
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <>
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
    </>
  );
}
