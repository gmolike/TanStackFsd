import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      // Spezifizieren des Verzeichnisses für die Routendateien
      routesDirectory: './src/routes',
      // Muster für Routendateien (passt auf route.tsx oder route.jsx Dateien)
      routeFilePattern: '**/*route.tsx',
      // Generiert die route.d.ts-Datei bei Änderungen automatisch neu
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});