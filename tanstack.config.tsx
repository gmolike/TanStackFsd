import { defineConfig } from '@tanstack/config';
import React from 'react';

export default defineConfig({
  // TanStack Query Konfiguration
  query: {
    framework: 'react',

    // Spezielle Query-Konfiguration
    clientOptions: {
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 Minute
          gcTime: 5 * 60 * 1000, // 5 Minuten
          refetchOnWindowFocus: false,
          retry: 1,
        },
        mutations: {
          retry: 0,
        },
      },
    },

    // Build-Konfiguration
    build: {
      target: 'node',
      lib: {
        entry: './src/shared/api/index.ts',
      },
    },
  },

  // TanStack Router Konfiguration
  router: {
    // Für filebasiertes Routing
    routeFilePrefix: 'route',
    routesDirectory: './src/routes',
    generatedRouteTree: './src/routeTree.gen.ts',

    // Router-Optionen
    routerOptions: {
      caseSensitive: false,
      stringifySearch: true,
      parseSearch: true,
      defaultErrorComponent: ({ error }) => (
        <div>
          <h1>Error: {error.message}</h1>
          <pre>{error.stack}</pre>
        </div>
      ),
      defaultNotFoundComponent: () => (
        <div>
          <h1>404 - Seite nicht gefunden</h1>
          <p>Die angeforderte Seite existiert nicht.</p>
        </div>
      ),
      defaultPendingComponent: () => <div>Laden...</div>,
      defaultPreloadStaleTime: 60 * 1000, // 1 Minute
    },
  },
});
