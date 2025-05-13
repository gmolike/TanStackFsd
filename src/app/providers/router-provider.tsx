import { StrictMode } from 'react';
import type { JSX } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';

import { useAuth } from '~/shared/auth';
import { router } from '~/shared/router';

export const RouterProvider = (): JSX.Element => {
  const auth = useAuth();
  const queryClient = useQueryClient();

  // Update router context with auth and queryClient
  router.update({
    context: {
      auth,
      queryClient,
    },
  });

  return (
    <StrictMode>
      <TanStackRouterProvider router={router} />
    </StrictMode>
  );
};
