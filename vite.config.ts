import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

// ================= ENVIRONMENT CONFIGURATION =================

const getEnvironmentConfig = (mode: string, command: string) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';
  const isBuild = command === 'build';
  const shouldAnalyze = env.VITE_BUILD_ANALYZE === 'true';

  return {
    env,
    isDevelopment,
    isProduction,
    isBuild,
    shouldAnalyze,
  };
};

// ================= PLUGIN CONFIGURATION =================

const getPlugins = (config: ReturnType<typeof getEnvironmentConfig>) => {
  const plugins = [
    // TypeScript path mapping
    tsconfigPaths({
      projects: ['./tsconfig.json'],
    }),

    // React plugin with React 19 optimizations
    react({
      // Enable React DevTools in development
      include: '**/*.{jsx,tsx}',

      // React 19 features
      jsxRuntime: 'automatic',

      // Babel configuration for React 19
      babel: {
        plugins: config.isDevelopment ? [] : [],
        parserOpts: {
          plugins: ['jsx', 'typescript'],
        },
      },

      // Fast Refresh configuration
      fastRefresh: config.isDevelopment,
    }),

    // TanStack Router plugin
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      routeFileIgnorePrefix: '-',
      quoteStyle: 'single',
    }),
  ];

  // Add bundle analyzer in production if requested
  if (config.isBuild && config.shouldAnalyze) {
    import('vite-bundle-analyzer').then(({ analyzer }) => {
      plugins.push(
        analyzer({
          analyzerMode: 'static',
          reportFilename: 'bundle-analyzer-report.html',
          openAnalyzer: false,
        }),
      );
    });
  }

  return plugins;
};

// ================= BUILD OPTIMIZATION =================

const getBuildConfig = (config: ReturnType<typeof getEnvironmentConfig>) => {
  return {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: config.isDevelopment || config.env.VITE_BUILD_SOURCEMAP === 'true',
    minify: config.isProduction ? 'esbuild' : false,

    // Chunk splitting strategy
    rollupOptions: {
      output: {
        chunkFileNames: (chunkInfo: { name: string; moduleIds: any[] }) => {
          // Vendor chunks
          if (chunkInfo.name === 'vendor') {
            return 'assets/vendor.[hash].js';
          }

          // React chunks
          if (chunkInfo.moduleIds.some((id: string | string[]) => id.includes('react'))) {
            return 'assets/react.[hash].js';
          }

          // Router chunks
          if (
            chunkInfo.moduleIds.some((id: string | string[]) => id.includes('@tanstack/router'))
          ) {
            return 'assets/router.[hash].js';
          }

          // UI library chunks
          if (
            chunkInfo.moduleIds.some(
              (id: string | string[]) => id.includes('@radix-ui') || id.includes('lucide'),
            )
          ) {
            return 'assets/ui.[hash].js';
          }

          // Default chunk naming
          return 'assets/[name].[hash].js';
        },

        manualChunks: {
          // Vendor chunk for external dependencies
          vendor: ['react', 'react-dom', 'react-hook-form', 'zod', 'axios', 'date-fns'],

          // Query chunk for data fetching
          query: ['@tanstack/react-query', '@tanstack/react-query-devtools'],

          // Router chunk
          router: ['@tanstack/react-router', '@tanstack/router-devtools'],

          // UI chunk for component libraries
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            'lucide-react',
          ],

          // Utils chunk
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },

    // Performance optimizations
    reportCompressedSize: config.isProduction,
    chunkSizeWarningLimit: 1000,

    // CSS configuration
    cssCodeSplit: true,
    cssMinify: config.isProduction,
  };
};

// ================= DEVELOPMENT SERVER =================

const getServerConfig = (config: ReturnType<typeof getEnvironmentConfig>) => {
  return {
    port: 3000,
    strictPort: false,
    host: true,
    open: false,

    // HTTPS configuration for development
    https:
      config.env.VITE_DEV_HTTPS === 'true'
        ? {
            // You can provide custom certificates here
            // cert: fs.readFileSync('path/to/cert.pem'),
            // key: fs.readFileSync('path/to/key.pem'),
          }
        : false,

    // Hot Module Replacement
    hmr: {
      overlay: true,
      clientPort: config.env.VITE_HMR_PORT ? parseInt(config.env.VITE_HMR_PORT) : undefined,
    },

    // API proxy configuration (if needed)
    proxy:
      config.env.VITE_API_PROXY === 'true'
        ? {
            '/api': {
              target: config.env.VITE_API_URL || 'http://localhost:8080',
              changeOrigin: true,
              secure: false,
              ws: true,
              configure: (
                proxy: {
                  on: (
                    arg0: string,
                    arg1: {
                      (err: any, _req: any, _res: any): void;
                      (proxyReq: any, req: any, _res: any): void;
                      (proxyRes: any, req: any, _res: any): void;
                    },
                  ) => void;
                },
                _options: any,
              ) => {
                proxy.on('error', (err: any, _req: any, _res: any) => {
                  console.log('proxy error', err);
                });
                proxy.on('proxyReq', (proxyReq: any, req: { method: any; url: any }, _res: any) => {
                  console.log('Sending Request to the Target:', req.method, req.url);
                });
                proxy.on(
                  'proxyRes',
                  (proxyRes: { statusCode: any }, req: { url: any }, _res: any) => {
                    console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                  },
                );
              },
            },
          }
        : undefined,

    // CORS configuration
    cors: {
      origin: true,
      credentials: true,
    },

    // File watching configuration
    watch: {
      usePolling: config.env.VITE_USE_POLLING === 'true',
      interval: 1000,
    },
  };
};

// ================= PREVIEW SERVER =================

const getPreviewConfig = () => {
  return {
    port: 4173,
    strictPort: false,
    host: true,
    open: false,
  };
};

// ================= OPTIMIZATION =================

const getOptimizeDeps = (config: ReturnType<typeof getEnvironmentConfig>) => {
  return {
    include: [
      'react',
      'react-dom',
      'react-hook-form',
      '@hookform/resolvers/zod',
      'zod',
      'axios',
      'date-fns',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      'lucide-react',
      '@tanstack/react-query',
      '@tanstack/react-router',
      '@tanstack/react-table',
    ],

    exclude: config.isDevelopment
      ? ['@tanstack/react-query-devtools', '@tanstack/router-devtools']
      : [],

    // Force optimization of certain packages
    force: config.isDevelopment,
  };
};

// ================= MAIN CONFIGURATION =================

export default defineConfig(({ command, mode }) => {
  const config = getEnvironmentConfig(mode, command);

  // Log build information
  console.log(`🔧 Vite ${command} mode: ${mode}`);
  console.log(`📦 Target: ${config.isProduction ? 'Production' : 'Development'}`);

  if (config.shouldAnalyze) {
    console.log('📊 Bundle analysis enabled');
  }

  return {
    // Base configuration
    base: config.env.VITE_BASE_PATH || '/',
    mode,

    // Plugin configuration
    plugins: getPlugins(config),

    // Path resolution
    resolve: {
      alias: {
        '~': resolve(__dirname, './src'),
        '@': resolve(__dirname, './src'),
      },
    },

    // Build configuration
    build: getBuildConfig(config),

    // Development server
    server: getServerConfig(config),

    // Preview server
    preview: getPreviewConfig(),

    // Dependency optimization
    optimizeDeps: getOptimizeDeps(config),

    // CSS configuration
    css: {
      devSourcemap: config.isDevelopment,
      modules: {
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "~/shared/styles/variables.scss";`,
        },
      },
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __COMMIT_HASH__: JSON.stringify(process.env.COMMIT_HASH || 'unknown'),
    },

    // ESBuild configuration
    esbuild: {
      target: 'esnext',
      supported: {
        'top-level-await': true,
      },
      // Remove console.log in production
      drop: config.isProduction ? ['console', 'debugger'] : [],
    },

    // Worker configuration
    worker: {
      format: 'es',
    },

    // JSON configuration
    json: {
      namedExports: true,
      stringify: false,
    },

    // Log level
    logLevel: config.isDevelopment ? 'info' : 'warn',

    // Clear screen
    clearScreen: false,
  };
});
