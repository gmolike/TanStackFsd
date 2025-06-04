// src/widgets/layout/ui/root-layout.tsx
import { useState } from 'react';
import type { ReactNode } from 'react';

import { useLocation } from '@tanstack/react-router';
import { Menu } from 'lucide-react';

import { Breadcrumb } from '~/shared/ui/breadcrumb';
import { Sidebar } from '~/shared/ui/sidebar';

import { Button } from '../shadcn';

// ================= TYPES =================
type RootLayoutProps = {
  children: ReactNode;
};

// ================= LOGIC =================
export const RootLayout = ({ children }: RootLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // ================= RETURN =================
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b bg-white shadow-sm">
          <div className="flex items-center px-4 py-3">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4">
              <Menu className="h-5 w-5" />
            </Button>
            <Breadcrumb />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
