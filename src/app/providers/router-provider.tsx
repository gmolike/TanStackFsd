import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';
import { JSX, StrictMode } from 'react';

import { Router, useAuth } from '~/shared/auth';

// Register things for typesafety
declare module '@tanstack/react-router' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
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
