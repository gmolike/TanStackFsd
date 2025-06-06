import { createFileRoute } from '@tanstack/react-router';

import { TeamEditorPage } from '~/pages/team';

export const Route = createFileRoute('/team_/$memberId/edit')({
  component: TeamEditorPage,
});
