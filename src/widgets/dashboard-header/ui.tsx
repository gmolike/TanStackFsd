import { JSX } from 'react';

import { User, UserAvatar, UserInfo } from '~/entities';
import { useAuth } from '~/shared/hooks/auth';
import { Button } from '~/shared/ui/button';

type DashboardHeaderProps = {
  user: User | null;
};

export const DashboardHeader = ({ user }: DashboardHeaderProps): JSX.Element => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
      <div className="text-xl font-bold text-gray-800">TS React Dashboard</div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <UserAvatar user={user} size="sm" />
          <UserInfo user={user} />
        </div>

        <Button variant="outline" size="sm" onClick={handleLogout} className="ml-2">
          Abmelden
        </Button>
      </div>
    </header>
  );
};
