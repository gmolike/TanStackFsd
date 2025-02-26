import { JSX } from 'react';

export const DashboardSidebar = (): JSX.Element => {
  const menuItems = [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Benutzer', icon: '👥' },
    { label: 'Produkte', icon: '📦' },
    { label: 'Einstellungen', icon: '⚙️' },
    { label: 'Hilfe', icon: '❓' },
  ];

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          padding: '0 1.5rem',
          marginBottom: '2rem',
          fontSize: '1.25rem',
          fontWeight: 'bold',
        }}
      >
        Menu
      </div>

      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => {
                  /* Handle navigation */
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  color: 'white',
                  backgroundColor: index === 0 ? '#374151' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                aria-label={item.label}
              >
                <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
