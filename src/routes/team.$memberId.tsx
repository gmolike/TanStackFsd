import { createFileRoute } from '@tanstack/react-router';

import { TeamDetailPage } from '~/pages/team';

export const Route = createFileRoute('/team/$memberId')({
  component: TeamDetailPage,
});
