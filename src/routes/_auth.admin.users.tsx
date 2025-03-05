import { createFileRoute } from '@tanstack/react-router';

import { UsersPage } from '~/pages/admin/user';

export const Route = createFileRoute('/_auth/admin/users')({
  component: RouteComponent,
});

function RouteComponent() {
  return <UsersPage />;
}
