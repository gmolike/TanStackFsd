import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
      // Spezifizieren des Verzeichnisses für die Routendateien
      routesDirectory: './src/routes',
      // Generiert die route.d.ts-Datei bei Änderungen automatisch neu
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8090,
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
