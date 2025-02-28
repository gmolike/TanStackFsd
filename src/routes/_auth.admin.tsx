import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
      <Outlet />
    </div>
  );
}
