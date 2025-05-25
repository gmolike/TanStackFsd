import { tanstackViteConfig } from '@tanstack/config/vite';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import type { UserConfig } from 'vite';
import { defineConfig, loadEnv, mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default ({ mode }: { mode: string }): UserConfig => {
  // Load environment variables based on current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  // Set default API URL if none is defined in the environment
  const apiUrl =
    env.VITE_API_URL ||
    (mode === 'production'
      ? 'https://api.production.com'
      : mode === 'staging'
        ? 'https://api.staging.com'
        : 'http://localhost:3001');

  console.warn(`Mode: ${mode}, API URL: ${apiUrl}`);

  const config = defineConfig({
    plugins: [
      TanStackRouterVite({
        target: 'react',
        autoCodeSplitting: true,
        // Specify directory for route files
        routesDirectory: './src/routes',
        // Automatically regenerate route.d.ts file when changes occur
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
      host: true,
      port: 8090,
      open: true,
      // Proxy settings if needed
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
    preview: { port: 8090, strictPort: true },
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
    // Define environment variables available in client code
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
      'import.meta.env.MODE': JSON.stringify(mode),
      // Add additional environment variables as needed
      ...Object.keys(env).reduce((acc: Record<string, unknown>, key: string) => {
        if (key.startsWith('VITE_')) {
          acc[`import.meta.env.${key}`] = JSON.stringify(env[key]);
        }
        return acc;
      }, {}),
    },
  });

  return mergeConfig(
    config,
    tanstackViteConfig({
      entry: './src/main.tsx',
      srcDir: './src',
    }),
  );
};
