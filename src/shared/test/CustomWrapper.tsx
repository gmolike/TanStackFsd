import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AnyRoute, ReactNode } from '@tanstack/react-router';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';

const testRouter = (children: ReactNode) => {
  const rootRoute = createRootRoute({
    component: Outlet,
  });
  const componentRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => children,
  });

  return createRouter({
    routeTree: rootRoute.addChildren([componentRoute] as
      | Record<string, AnyRoute>
      | ReadonlyArray<AnyRoute>),
    history: createMemoryHistory(),
  });
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const CustomWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={testRouter(children) as never} />
  </QueryClientProvider>
);

export default CustomWrapper;
