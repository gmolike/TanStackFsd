import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '~/pages/login-page';

export const Route = createFileRoute('/login')({
  component: LoginPage,
  beforeLoad: ({ context }) => {
    // Wenn bereits angemeldet, umleiten zum Dashboard
    if (!context.auth.isLoading && context.auth.user) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
});
