// src/routes/team.new.tsx
import { createFileRoute } from '@tanstack/react-router';

import { TeamEditorPage } from '~/pages/team';

export const Route = createFileRoute('/team/new')({
  component: TeamEditorPage,
});
