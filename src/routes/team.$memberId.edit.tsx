// src/routes/team.$memberId.edit.tsx (Edit Route - /team/:memberId/edit)
import { createFileRoute } from '@tanstack/react-router';

import { TeamEditorPage } from '~/pages/team';

export const Route = createFileRoute('/team/$memberId/edit')({
  component: TeamEditorPage,
});
