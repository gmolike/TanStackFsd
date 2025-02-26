import { JSX } from 'react';
import { User } from '~/entities';

type Props = {
  user: User | null;
  showRole?: boolean;
};

export const Info = ({ user, showRole = false }: Props): JSX.Element | null => {
  if (!user) return null;

  return (
    <div>
      <div style={{ fontWeight: 'bold' }}>{user.name}</div>
      {showRole && <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{user.role}</div>}
    </div>
  );
};
