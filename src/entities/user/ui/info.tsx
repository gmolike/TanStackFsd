import { JSX } from 'react';
import { User } from '~/entities';

type UserInfoProps = {
  user: User | null;
  showRole?: boolean;
};

export const UserInfo = ({ user, showRole = false }: UserInfoProps): JSX.Element | null => {
  if (!user) return null;

  return (
    <div>
      <div style={{ fontWeight: 'bold' }}>{user.name}</div>
      {showRole && <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{user.role}</div>}
    </div>
  );
};
