import { type User, UserAvatar, UserInfo } from '~/entities/user';
import { useAuth } from '~/app/providers';
import { Button } from '~/shared/ui/button';

interface DashboardHeaderProps {
  user: User | null;
}

export const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
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
