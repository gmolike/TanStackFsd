import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import type { AuthContextType } from '~/shared/auth';

type Props = {
  auth: AuthContextType;
};

export const Route = createRootRouteWithContext<Props>()({
  component: () => (
    <div>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
    </div>
  ),
});
