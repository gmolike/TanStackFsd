import { JSX } from 'react';

export const DashboardSidebar = (): JSX.Element => {
  const menuItems = [
    { label: 'Dashboard', icon: '📊', active: true },
    { label: 'Benutzer', icon: '👥', active: false },
    { label: 'Produkte', icon: '📦', active: false },
    { label: 'Einstellungen', icon: '⚙️', active: false },
    { label: 'Hilfe', icon: '❓', active: false },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white">
      <div className="p-6 text-xl font-bold">Menu</div>

      <nav className="mt-6">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.active ? (
                // Aktives Item als Button ohne Navigation
                <button
                  className="flex w-full items-center bg-gray-700 px-6 py-3 text-white"
                  aria-current="page"
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.label}
                </button>
              ) : (
                // Inaktives Item als echter Link
                <a
                  href={item.label}
                  className="flex items-center px-6 py-3 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
