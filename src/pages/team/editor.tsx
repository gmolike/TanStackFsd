// src/pages/team/editor.tsx
import { useParams, useRouterState } from '@tanstack/react-router';

import { TeamEditorWidget } from '~/widgets/team';

export const Editor = () => {
  const params = useParams({ strict: false });
  const routerState = useRouterState();

  // Debug logging
  console.log('Current route:', routerState.location.pathname);
  console.log('Params:', params);

  // Prüfe ob wir auf der /team/new Route sind
  const isNewRoute = routerState.location.pathname === '/team/new';
  const memberId = params.memberId;

  // Key prop hinzufügen, damit die Komponente neu rendert
  const key = isNewRoute ? 'new' : memberId || 'unknown';

  return <TeamEditorWidget key={key} memberId={isNewRoute ? undefined : memberId} />;
};
