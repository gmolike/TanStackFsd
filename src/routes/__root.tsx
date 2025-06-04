// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { RootLayout } from '../shared/ui/root-layout';

// ================= TYPES =================
// Keine spezifischen Typen für Root Route benötigt

// ================= LOGIC =================
const rootRoute = createRootRoute({
  component: RootComponent,
});

// ================= RETURN =================
function RootComponent() {
  return (
    <>
      <RootLayout>
        <Outlet />
      </RootLayout>
      <TanStackRouterDevtools />
    </>
  );
}

export const Route = rootRoute;
