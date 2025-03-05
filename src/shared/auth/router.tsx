// Set up a Router instance

import { createRouter } from '@tanstack/react-router';

import { routeTree } from '~/routeTree.gen';

export const Router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
});
