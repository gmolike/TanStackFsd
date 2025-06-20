import { tanstackViteConfig } from '@tanstack/config/vite';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import type { PreRenderedChunk } from 'rollup';
import type { UserConfig } from 'vite';
import { defineConfig, loadEnv, mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// ========================================
// HELPER FUNCTIONS (reduziert Complexity)
// ========================================

/**
 * Bestimmt die API URL basierend auf Mode und Environment
 */
const getApiUrl = (mode: string, envApiUrl?: string): string => {
  if (envApiUrl) {
    return envApiUrl;
  }

  switch (mode) {
    case 'production':
      return 'https://api.production.com';
    case 'staging':
      return 'https://api.staging.com';
    default:
      return 'http://localhost:3001';
  }
};

/**
 * Vendor Chunk Mapping
 */
const getVendorChunk = (id: string): string => {
  const vendorMappings = [
    { test: /react(-dom)?/, chunk: 'react-vendor' },
    { test: /@tanstack\/react-router/, chunk: 'tanstack-router' },
    { test: /@tanstack\/react-query/, chunk: 'tanstack-query' },
    { test: /@tanstack/, chunk: 'tanstack-vendor' },
    { test: /lucide-react/, chunk: 'icons-vendor' },
    { test: /zod/, chunk: 'validation-vendor' },
    { test: /react-hook-form/, chunk: 'form-vendor' },
  ];

  const mapping = vendorMappings.find(({ test }) => test.test(id));
  return mapping ? mapping.chunk : 'vendor';
};

/**
 * Shared Layer Chunk Mapping
 */
const getSharedChunk = (id: string): string => {
  // UI Components
  if (id.includes('/shared/ui/')) {
    if (id.includes('/data-table/') || id.includes('/dataTable/')) {
      return 'shared-datatable';
    }
    if (id.includes('/form/')) {
      return 'shared-form';
    }
    return 'shared-ui';
  }

  // Andere Shared Module
  const sharedMappings: Record<string, string> = {
    '/shared/shadcn/': 'shared-shadcn',
    '/shared/api/': 'shared-api',
  };

  for (const [path, chunk] of Object.entries(sharedMappings)) {
    if (id.includes(path)) {
      return chunk;
    }
  }

  return 'shared-core';
};

/**
 * FSD Layer Chunk Mapping
 */
const getFSDLayerChunk = (id: string): string | undefined => {
  // App Layer
  if (id.includes('/app/')) {
    return 'app';
  }

  // Dynamic Layer Mappings mit Subdomain
  const layerMappings = [
    { pattern: /\/widgets\/([^/]+)/, prefix: 'widget' },
    { pattern: /\/features\/([^/]+)/, prefix: 'feature' },
  ];

  for (const { pattern, prefix } of layerMappings) {
    const match = RegExp(pattern).exec(id);
    if (match) {
      return `${prefix}-${match[1]}`;
    }
  }

  // Static Mappings
  if (id.includes('/entities/')) {
    return 'entities';
  }

  if (id.includes('/shared/')) {
    return getSharedChunk(id);
  }

  return undefined;
};

/**
 * Main Manual Chunks Function
 */
const manualChunks = (id: string): string => {
  // Handle node_modules
  if (id.includes('node_modules')) {
    return getVendorChunk(id);
  }

  // Handle src files
  if (id.includes('/src/')) {
    return getFSDLayerChunk(id) ?? 'app';
  }

  return 'app';
};

/**
 * Chunk File Names basierend auf Layer
 */
const getChunkFileName = (chunkInfo: PreRenderedChunk): string => {
  const { name, facadeModuleId } = chunkInfo;

  // Vendor chunks
  if (name?.includes('vendor')) {
    return 'vendor/[name]-[hash].js';
  }

  // FSD Layer based paths
  const layerPaths: Record<string, string> = {
    widgets: 'widgets/[name]-[hash].js',
    features: 'features/[name]-[hash].js',
    entities: 'entities/[name]-[hash].js',
    shared: 'shared/[name]-[hash].js',
  };

  if (facadeModuleId) {
    for (const [layer, path] of Object.entries(layerPaths)) {
      if (facadeModuleId.includes(layer)) {
        return path;
      }
    }
  }

  return 'chunks/[name]-[hash].js';
};

// ========================================
// MAIN CONFIG
// ========================================

export default ({ mode }: { mode: string }): UserConfig => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = getApiUrl(mode, env.VITE_API_URL);

  console.warn(`Mode: ${mode}, API URL: ${apiUrl}`);

  const config = defineConfig({
    plugins: [
      TanStackRouterVite({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: './src/routes',
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

    preview: {
      port: 8090,
      strictPort: true,
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
      rollupOptions: {
        output: {
          manualChunks,
          chunkFileNames: getChunkFileName,
        },
      },
      chunkSizeWarningLimit: 1000,
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@tanstack/react-router',
        '@tanstack/react-query',
        'zod',
        'react-hook-form',
      ],
    },

    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
      'import.meta.env.MODE': JSON.stringify(mode),
      ...Object.keys(env).reduce((acc: Record<string, string>, key: string) => {
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
