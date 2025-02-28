import { Link, useMatchRoute } from '@tanstack/react-router';

export const DashboardSidebar = () => {
  const matchRoute = useMatchRoute();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      active: matchRoute({ to: '/dashboard' }),
    },
    {
      label: 'Users',
      icon: '👥',
      path: '/admin/users',
      active: matchRoute({ to: '/admin/users' }),
    },
    {
      label: 'Products',
      icon: '📦',
      path: '/admin/products',
      active: matchRoute({ to: '/admin/products' }),
    },
    { label: 'Settings', icon: '⚙️', path: '/settings', active: matchRoute({ to: '/settings' }) },
    { label: 'Help', icon: '❓', path: '/help', active: matchRoute({ to: '/help' }) },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white">
      <div className="p-6 text-xl font-bold">Menu</div>

      <nav className="mt-6">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.active ? (
                // Aktives Element
                <span
                  className="flex items-center bg-gray-700 px-6 py-3 text-white"
                  aria-current="page"
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.label}
                </span>
              ) : (
                // Inaktives Element
                <Link
                  to={item.path}
                  className="flex items-center px-6 py-3 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
