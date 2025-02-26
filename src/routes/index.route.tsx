import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    // Falls Benutzer eingeloggt ist, direkt zum Dashboard weiterleiten
    if (context.user) {
      throw redirect({
        to: '/dashboard',
      });
    }
    // Falls nicht eingeloggt, zum Login weiterleiten
    throw redirect({
      to: '/login',
    });
  },
});
