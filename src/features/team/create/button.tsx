import { useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import { Button as ShadCnButton } from '~/shared/shadcn';

export const Button = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/team/new' });
  };

  return (
    <ShadCnButton onClick={handleClick}>
      <Plus className="mr-2 h-4 w-4" />
      Neues Mitglied
    </ShadCnButton>
  );
};
