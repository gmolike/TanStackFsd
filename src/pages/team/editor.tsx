// src/pages/team/editor.tsx
import { useLocation, useParams } from '@tanstack/react-router';

import { TeamEditorWidget } from '~/widgets/team';

export const Editor = () => {
  const location = useLocation();
  const params = useParams({ strict: false });

  // Prüfe ob wir auf der /team/new Route sind
  const isNewRoute = location.pathname === '/team/new';
  const memberId = params.memberId;

  return <TeamEditorWidget memberId={isNewRoute ? undefined : memberId} />;
};
