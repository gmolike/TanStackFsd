import { createFileRoute } from '@tanstack/react-router';

import { SimpleFormExample } from '~/pages/dashboard-page/ui/SimpleForm';

export const Route = createFileRoute('/_auth/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SimpleFormExample />;
}
