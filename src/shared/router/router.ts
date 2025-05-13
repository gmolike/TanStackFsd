import { createRouter } from '@tanstack/react-router';

import { routeTree } from '~/routeTree.gen';

import type { RouterContext } from './context';

// Create a new router instance with typed context
export const router = createRouter({
  routeTree,
  context: {} as RouterContext,
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export type Router = typeof router;
