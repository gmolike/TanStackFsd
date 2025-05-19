import type { JSX } from 'react';

import { DashboardHeader, DashboardSidebar } from '~/widgets';

import { useAuth } from '~/shared/auth';

import { TerminForm } from './ui/TerminForm';

export const DashboardPage = (): JSX.Element => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader user={user} />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto p-8">
          <h1 className="text-2xl font-bold text-gray-900">Willkommen im Dashboard</h1>
          <p className="mt-2 text-gray-600">Hallo {user?.name}, Sie sind erfolgreich eingeloggt.</p>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">Übersicht</h2>

            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { title: 'Benutzer', value: '1.234', color: 'bg-blue-500', icon: 'users' },
                {
                  title: 'Einnahmen',
                  value: '€ 12.345',
                  color: 'bg-green-500',
                  icon: 'currency-euro',
                },
                {
                  title: 'Bestellungen',
                  value: '567',
                  color: 'bg-orange-500',
                  icon: 'shopping-cart',
                },
                { title: 'Tickets', value: '89', color: 'bg-purple-500', icon: 'ticket' },
              ].map((item, index) => (
                <div key={index} className="flex overflow-hidden rounded-lg bg-white shadow-md">
                  <div className={`${item.color} flex w-12 items-center justify-center text-white`}>
                    <span className="text-xl">
                      {item.icon === 'users' && '👥'}
                      {item.icon === 'currency-euro' && '€'}
                      {item.icon === 'shopping-cart' && '🛒'}
                      {item.icon === 'ticket' && '🎟️'}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-sm font-medium text-gray-500">{item.title}</span>
                    <span className="text-2xl font-semibold text-gray-900">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <TerminForm />
          </div>
        </main>
      </div>
    </div>
  );
};
