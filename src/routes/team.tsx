// src/routes/team.tsx
import { createFileRoute } from '@tanstack/react-router';

import { TeamListPage } from '~/pages/team';

export const Route = createFileRoute('/team')({
  component: TeamListPage,
});
