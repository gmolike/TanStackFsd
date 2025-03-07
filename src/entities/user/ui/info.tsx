import type { JSX } from 'react';

import type { User } from '~/entities';

type Props = {
  user: User | null;
  showRole?: boolean;
};

export const Info = ({ user, showRole = false }: Props): JSX.Element | null => {
  if (!user) return null;

  return (
    <div>
      <div className="font-medium text-gray-900">{user.name}</div>
      {showRole && <div className="text-sm text-gray-500">{user.role}</div>}
    </div>
  );
};
