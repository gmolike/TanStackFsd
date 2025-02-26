import { Router } from '@tanstack/react-router';

// Import der automatisch generierten Route-Struktur
import { routeTree } from '~/routeTree.gen';

// Router-Instanz mit der generierten Route-Struktur
export const router = new Router({
  routeTree,
  // Standardwerte für den Kontext
  context: {
    user: null,
    isLoading: true,
  },
  // Optionale Konfiguration
  defaultPreload: 'intent',
  defaultStaleTime: 60 * 1000, // 1 Minute
});

// Typdeklaration für die Router-Registrierung
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
