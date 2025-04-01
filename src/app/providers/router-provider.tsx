import { StrictMode } from 'react';
import type { JSX } from 'react';

import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';

import { Router, useAuth } from '~/shared/auth';

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof Router;
  }
}

export const RouterProvider = (): JSX.Element => {
  const auth = useAuth();
  return (
    <StrictMode>
      <TanStackRouterProvider router={Router} context={{ auth }} />
    </StrictMode>
  );
};
