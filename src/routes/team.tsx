// src/routes/team.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/team')({
  component: TeamLayout,
});

function TeamLayout() {
  return (
    <div className="container mx-auto py-8">
      <Outlet />
    </div>
  );
}
