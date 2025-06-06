// src/routes/team.index.tsx (List Route - /team)
import { createFileRoute } from '@tanstack/react-router';

import { TeamListPage } from '~/pages/team';

export const Route = createFileRoute('/team/')({
  component: TeamListPage,
});
