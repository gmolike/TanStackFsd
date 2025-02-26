import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';
import { JSX, StrictMode, useEffect } from 'react';

import { router } from '~/shared/config/routes';
import { useAuth } from '~/shared/hooks/auth/useAuth';

export const RouterProvider = (): JSX.Element => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Instead of directly modifying router.context,
  // use the router's built-in methods for updating context
  useEffect(() => {
    router.update({
      context: {
        user,
        isLoading,
        isAuthenticated,
      },
    });
  }, [user, isLoading, isAuthenticated]);

  return (
    <StrictMode>
      <TanStackRouterProvider router={router} />
    </StrictMode>
  );
};
