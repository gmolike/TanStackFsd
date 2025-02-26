import { defineConfig } from '@tanstack/config'

export default defineConfig({
  // TanStack Query Konfiguration
  query: {
    framework: 'react',
    build: {
      target: 'node',
      lib: {
        entry: './src/shared/api/index.ts',
      },
    },
  },
  // TanStack Router Konfiguration
  router: {
    routeFilePrefix: 'route',
    // Berücksichtigen der FSD-Struktur
    routesDirectory: './src/pages',
  },
})