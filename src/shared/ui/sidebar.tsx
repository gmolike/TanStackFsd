// src/shared/ui/sidebar.tsx
import { useState } from 'react';

import { Link, useLocation } from '@tanstack/react-router';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Home,
  LogOut,
  Package,
  UserPlus,
  Users,
} from 'lucide-react';

import { cn } from '~/shared/lib/utils';

// ================= TYPES =================
type SidebarProps = {
  isOpen: boolean;
};

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: Array<NavigationItem>;
};

// ================= LOGIC =================
/**
 * Sidebar component for navigation
 * @param {SidebarProps} props - Component props
 * @returns {JSX.Element} Sidebar component
 */
export const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['Team']));

  const navigationItems: Array<NavigationItem> = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Artikel', href: '/articles', icon: Package },
    {
      name: 'Team',
      href: '/team',
      icon: Users,
      children: [
        { name: 'Übersicht', href: '/team', icon: Users },
        { name: 'Neues Teammitglied', href: '/team/new', icon: UserPlus },
      ],
    },
    { name: 'Standorte', href: '/locations', icon: Building2 },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === href;
    }
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const isParentActive = (item: NavigationItem) => {
    if (!item.children) return false;
    return item.children.some((child) => isActive(child.href));
  };

  const toggleExpanded = (name: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedItems(newExpanded);
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.name);
    const isCurrentActive = isActive(item.href);
    const isParent = isParentActive(item);

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={cn(
              'group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
              isCurrentActive || isParent
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              level > 0 && 'pl-8',
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className={cn('ml-3 flex-1 text-left', !isOpen && 'hidden')}>{item.name}</span>
            {isOpen && (
              <span className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
          </button>
          {isExpanded && isOpen && (
            <div className="mt-1 space-y-1">
              {item.children?.map((child) => renderNavigationItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        className={cn(
          'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
          isCurrentActive
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
          level > 0 && 'pl-8',
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span className={cn('ml-3', !isOpen && 'hidden')}>{item.name}</span>
      </Link>
    );
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
          {navigationItems.map((item) => renderNavigationItem(item))}
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
