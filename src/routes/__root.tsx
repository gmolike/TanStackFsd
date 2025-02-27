import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { AuthContext } from '~/shared/hooks/auth/type';

type Props = {
  auth: AuthContext;
};

export const Route = createRootRouteWithContext<Props>()({
  component: () => (
    <div>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
    </div>
  ),
});
