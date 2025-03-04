import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Lädt die Umgebungsvariablen basierend auf dem aktuellen Modus (development, production, usw.)
  const env = loadEnv(mode, process.cwd(), '');

  // Standard API-URL festlegen, falls keine in der Umgebung definiert ist
  const apiUrl =
    env.VITE_API_URL ||
    (mode === 'production'
      ? 'https://api.production.com'
      : mode === 'staging'
        ? 'https://api.staging.com'
        : 'http://localhost:3001');

  console.warn(`Mode: ${mode}, API URL: ${apiUrl}`);

  return {
    plugins: [
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
      // Proxy-Einstellungen, falls benötigt
      proxy:
        env.VITE_ENABLE_PROXY === 'true'
          ? {
              '/api': {
                target: apiUrl,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
              },
            }
          : undefined,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
        },
      },
    },
    // Definiere Umgebungsvariablen, die im Client-Code verfügbar sein sollen
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
      'import.meta.env.MODE': JSON.stringify(mode),
      // Weitere Umgebungsvariablen nach Bedarf hinzufügen
      ...Object.keys(env).reduce((acc, key) => {
        if (key.startsWith('VITE_')) {
          acc[`import.meta.env.${key}`] = JSON.stringify(env[key]);
        }
        return acc;
      }, {}),
    },
  };
});
