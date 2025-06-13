import { setupWorker } from 'msw/browser';

import { config } from '~/shared/config/env';
import { handlers } from './handlers';

// ================= WORKER SETUP =================

export const worker = setupWorker(...handlers);

// ================= DEVELOPMENT HELPERS =================

if (config.isDevelopment) {
  // Add worker to window for debugging
  (window as any).__MSW_WORKER__ = worker;

  // Add helper functions for development
  (window as any).__MSW_HELPERS__ = {
    // Start/stop worker
    start: () => worker.start(),
    stop: () => worker.stop(),

    // Reset handlers
    resetHandlers: () => worker.resetHandlers(),

    // Use specific handlers for testing scenarios
    useHandlers: (...newHandlers: any[]) => worker.use(...newHandlers),

    // Log all requests
    enableLogging: () =>
      worker.start({
        onUnhandledRequest: 'warn',
        serviceWorker: {
          options: {
            scope: '/',
          },
        },
      }),

    // Disable logging
    disableLogging: () =>
      worker.start({
        onUnhandledRequest: 'bypass',
        quiet: true,
      }),
  };
}

// ================= WORKER CONFIGURATION =================

export const startMockWorker = async (): Promise<void> => {
  if (!config.features.enableMockApi) {
    console.log('🔄 Mock API disabled via config');
    return;
  }

  try {
    await worker.start({
      // Only intercept requests in development
      serviceWorker: {
        url: '/mockServiceWorker.js',
        options: {
          scope: '/',
        },
      },

      // Handle unmatched requests
      onUnhandledRequest(request, print) {
        // Ignore requests to external domains
        const url = new URL(request.url);
        if (url.origin !== window.location.origin) {
          return;
        }

        // Ignore specific paths
        const ignoredPaths = [
          '/assets/',
          '/icons/',
          '/images/',
          '/favicon.ico',
          '/manifest.json',
          '/sw.js',
          '/mockServiceWorker.js',
        ];

        if (ignoredPaths.some((path) => url.pathname.startsWith(path))) {
          return;
        }

        // Only warn about API requests
        if (url.pathname.startsWith('/api/')) {
          print.warning();
        }
      },

      // Quiet mode in production builds
      quiet: config.isProduction,
    });

    if (config.isDevelopment) {
      console.log('🎭 MSW: Mock API ready');
      console.log('📝 Available endpoints:');
      console.log('  • Auth: /api/auth/login, /api/auth/register, /api/auth/me');
      console.log('  • Users: /api/users, /api/users/me, /api/users/:id');
      console.log('  • Health: /api/health');
      console.log('🔧 Access MSW helpers via window.__MSW_HELPERS__');
    }
  } catch (error) {
    console.error('❌ Failed to start MSW worker:', error);
  }
};

// ================= TEST UTILITIES =================

/**
 * Creates a clean worker instance for testing
 */
export const createTestWorker = () => {
  return setupWorker(...handlers);
};

/**
 * Resets the worker to default handlers
 */
export const resetWorker = () => {
  worker.resetHandlers(...handlers);
};

/**
 * Temporarily overrides handlers for testing specific scenarios
 */
export const withMockHandlers = (newHandlers: any[], callback: () => void | Promise<void>) => {
  const originalHandlers = [...handlers];

  return async () => {
    worker.use(...newHandlers);

    try {
      await callback();
    } finally {
      worker.resetHandlers(...originalHandlers);
    }
  };
};

// ================= ERROR SCENARIOS =================

export const mockScenarios = {
  // Network errors
  networkError: (url: string) => {
    return worker.use(
      ...[url].map((endpoint) =>
        // This would need to be implemented based on the specific endpoint
        // For now, just a placeholder
        console.log(`Mocking network error for ${endpoint}`),
      ),
    );
  },

  // Server errors
  serverError: () => {
    // Implementation would override handlers to return 500 errors
    console.log('Mocking server errors');
  },

  // Slow responses
  slowResponses: (delay: number = 5000) => {
    // Implementation would add delays to all handlers
    console.log(`Mocking slow responses with ${delay}ms delay`);
  },

  // Authentication errors
  authErrors: () => {
    // Implementation would override auth handlers to return 401
    console.log('Mocking authentication errors');
  },
};

// ================= AUTO-START =================

// Auto-start in development if feature is enabled
if (config.isDevelopment && config.features.enableMockApi) {
  startMockWorker().catch(console.error);
}

// ================= EXPORTS =================

export default worker;
export type { MockApiResponse, MockPaginatedResponse } from './handlers';
