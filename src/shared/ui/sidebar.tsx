// src/shared/ui/sidebar.tsx
import { Link, useLocation } from '@tanstack/react-router';
import { Home, LogOut, Package, Users } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

// ================= TYPES =================
type SidebarProps = {
  isOpen: boolean;
};

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

// ================= LOGIC =================
/**
 * Sidebar component for navigation
 * @param {SidebarProps} props - Component props
 * @returns {JSX.Element} Sidebar component
 */
export const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();

  const navigationItems: Array<NavigationItem> = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Artikel', href: '/articles', icon: Package },
    { name: 'Team', href: '/team', icon: Users },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  // ================= RETURN =================
  return (
    <div
      className={cn('bg-gray-900 text-white transition-all duration-300', isOpen ? 'w-64' : 'w-16')}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-4">
          <h2 className={cn('font-semibold', !isOpen && 'hidden')}>Meine App</h2>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className={cn('ml-3', !isOpen && 'hidden')}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-700 p-4">
          <Link
            to="/login"
            onClick={handleLogout}
            className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className={cn('ml-3', !isOpen && 'hidden')}>Abmelden</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
