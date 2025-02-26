export const DashboardSidebar = () => {
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
              <a
                href="#"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                  backgroundColor: index === 0 ? '#374151' : 'transparent',
                }}
              >
                <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
