import { JSX } from 'react';
import { useAuth } from '~/shared/hooks/auth/useAuth';
import { DashboardHeader } from '~/widgets/dashboard-header';
import { DashboardSidebar } from '~/widgets/dashboard-sidebar';

export const DashboardPage = (): JSX.Element => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <DashboardHeader user={user} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <DashboardSidebar />

        <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          <h1>Willkommen im Dashboard</h1>
          <p>Hallo {user?.name}, Sie sind erfolgreich eingeloggt.</p>

          <div style={{ marginTop: '2rem' }}>
            <h2>Übersicht</h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              {[
                { title: 'Benutzer', value: '1.234', color: '#3b82f6' },
                { title: 'Einnahmen', value: '€ 12.345', color: '#22c55e' },
                { title: 'Bestellungen', value: '567', color: '#f97316' },
                { title: 'Tickets', value: '89', color: '#8b5cf6' },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    borderLeft: `4px solid ${item.color}`,
                  }}
                >
                  <h3 style={{ marginBottom: '0.5rem', color: '#374151' }}>{item.title}</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: item.color }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
