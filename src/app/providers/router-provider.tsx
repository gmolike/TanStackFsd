import { createRouter, RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';
import { JSX, StrictMode } from 'react';

import { useAuth } from '~/shared/hooks/auth/useAuth';

import { routeTree } from '../../routeTree.gen';

// Set up a Router instance
// eslint-disable-next-line react-refresh/only-export-components
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const RouterProvider = (): JSX.Element => {
  const auth = useAuth();
  return (
    <StrictMode>
      <TanStackRouterProvider router={router} context={{ auth }} />
    </StrictMode>
  );
};
