// Set up a Router instance

import type { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';

import { routeTree } from '~/routeTree.gen';

import type { AuthType } from './type';

// Define the router context type
interface RouterContext {
  auth: AuthType;
  queryClient: QueryClient;
}

export const Router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    // These will be set after we wrap the app in providers
    auth: undefined!,
    queryClient: undefined!,
  } as RouterContext,
});

// Add type declaration for the router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof Router;
  }
}
