import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/help')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/help"!</div>;
}
