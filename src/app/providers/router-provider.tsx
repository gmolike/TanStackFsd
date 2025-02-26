import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';
import { StrictMode, useEffect } from 'react';

import { useAuth } from './auth-provider';
import { router } from '~/shared/config/routes';

export const RouterProvider = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Aktualisiere den Router-Kontext basierend auf dem Auth-Status
  useEffect(() => {
    router.context = {
      ...router.context,
      user,
      isLoading,
    };
  }, [user, isLoading]);

  // Wenn sich der Auth-Status ändert, sollten wir die vorherige Route-Passung neu bewerten
  useEffect(() => {
    if (!isLoading) {
      // Versuche, den aktuellen Ort neu zu validieren
      router.invalidate();
    }
  }, [isAuthenticated, isLoading]);

  return (
    <StrictMode>
      <TanStackRouterProvider router={router} />
    </StrictMode>
  );
};
