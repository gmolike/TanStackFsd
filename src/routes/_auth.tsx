import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

// Diese Route dient als Layout für alle geschützten Routen
export const Route = createFileRoute('/_auth')({
  component: ProtectedLayout,
  beforeLoad: ({ context }) => {
    // Wenn nicht angemeldet und fertig geladen, umleiten zum Login
    if (!context.auth.isLoading && !context.auth.user) {
      throw redirect({
        to: '/login',
      });
    }
  },
});

function ProtectedLayout() {
  return <Outlet />;
}
