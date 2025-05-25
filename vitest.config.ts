import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
      '~/app': resolve(__dirname, './src/app'),
      '~/pages': resolve(__dirname, './src/pages'),
      '~/widgets': resolve(__dirname, './src/widgets'),
      '~/features': resolve(__dirname, './src/features'),
      '~/entities': resolve(__dirname, './src/entities'),
      '~/shared': resolve(__dirname, './src/shared'),
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/shared/test/setup.ts',
    include: ['./src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'dist-node', '.idea', '.git', '.cache', '**/e2e/**'],

    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/vite-env.d.ts',
        '**/*.test.*',
        '**/test-utils/**',
        'playwright/**',
        'src/routeTree.gen.ts',
      ],
      all: true,
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },

    // Reporter für bessere Ausgabe
    reporters: ['default', 'html'],

    // Pool-Optionen für bessere Performance
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4,
      },
    },

    // CSS Module Support
    css: {
      modules: {
        classNameStrategy: 'stable',
      },
    },

    testTimeout: 10000, // 10 Sekunden
    hookTimeout: 10000, // 10 Sekunden für beforeEach/afterEach
    isolate: true,

    // Mock-Konfiguration
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
  },
});
