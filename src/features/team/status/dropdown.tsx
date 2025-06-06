import type { TeamMember } from '~/entities/team';
import { useUpdateTeamMemberStatus } from '~/entities/team';

import { toast } from '~/shared/hooks/use-toast';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/shared/shadcn';

export type DropdownProps = {
  member: TeamMember;
  onSuccess?: () => void;
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  vacation: 'bg-blue-100 text-blue-800',
} as const;

const statusLabels = {
  active: 'Aktiv',
  inactive: 'Inaktiv',
  vacation: 'Urlaub',
} as const;

export const Dropdown = ({ member, onSuccess }: DropdownProps) => {
  const updateStatusMutation = useUpdateTeamMemberStatus({
    onSuccess: () => {
      toast({
        title: 'Status aktualisiert',
        description: 'Der Status wurde erfolgreich geändert.',
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Aktualisieren',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (status: 'active' | 'inactive' | 'vacation') => {
    updateStatusMutation.mutate({ id: member.id, status });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={statusColors[member.status]}>
          {statusLabels[member.status]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => handleStatusChange('active')}
          disabled={member.status === 'active'}
        >
          Aktiv
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange('inactive')}
          disabled={member.status === 'inactive'}
        >
          Inaktiv
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange('vacation')}
          disabled={member.status === 'vacation'}
        >
          Urlaub
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
