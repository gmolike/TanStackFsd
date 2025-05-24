import { createFileRoute } from '@tanstack/react-router';

import { UserForm } from '~/pages/dashboard-page/ui/TerminForm';

export const Route = createFileRoute('/_auth/admin/users')({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserForm />;
}
