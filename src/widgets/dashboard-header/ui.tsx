import { useRouter } from '@tanstack/react-router';
import { JSX } from 'react';
import { type User, UserAvatar, UserInfo } from '~/entities/user';
import { Route } from '~/routes';
import { useAuth } from '~/shared/hooks/auth/useAuth';
import { Button } from '~/shared/ui/button';

interface DashboardHeaderProps {
  user: User | null;
}

export const DashboardHeader = ({ user }: DashboardHeaderProps): JSX.Element => {
  const router = useRouter();
  const navigate = Route.useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      auth.logout().then(() => {
        router.invalidate().finally(() => {
          navigate({ to: '/' });
        });
      });
    }
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>TS React Dashboard</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserAvatar user={user} size="sm" />
          <UserInfo user={user} />
        </div>

        <Button variant="outline" size="sm" onClick={handleLogout}>
          Abmelden
        </Button>
      </div>
    </header>
  );
};
