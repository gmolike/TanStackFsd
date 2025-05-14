import { StrictMode } from 'react';
import type { JSX } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';

import { useAuth } from '~/shared/auth';
import { Router } from '~/shared/auth/router';
import { LoadingSpinner } from '~/shared/ui/LoadingSpinner';

export const RouterProvider = (): JSX.Element => {
  const auth = useAuth();
  const queryClient = useQueryClient();

  // Warten bis Auth geladen ist
  if (auth.isLoading) {
    return <LoadingSpinner />;
  }

  // Update router context mit auth und queryClient
  Router.update({
    context: {
      auth,
      queryClient,
    },
  });

  return (
    <StrictMode>
      <TanStackRouterProvider router={Router} />
    </StrictMode>
  );
};
