import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router';
import { type User } from '~/entities/user/model/types';

// Type für den Router-Kontext
type RouterContext = {
  user: User | null;
  isLoading: boolean;
};

// Root-Route
export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: ({ context }) => {
    // Wir können den isLoading-Status hier nutzen, um Entscheidungen zu treffen
    if (context.isLoading) {
      return; // Keine Umleitung während des Ladens
    }
  },
});

function RootComponent() {
  return (
    <>
      {/* Der Outlet rendert die aktive Kind-Route */}
      <Outlet />
    </>
  );
}
