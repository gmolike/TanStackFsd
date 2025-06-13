// src/shared/mock/browser.ts

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
          '/@vite/',
          '/@fs/',
          '/node_modules/',
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
      console.log('  • Team: /api/team-members, /api/team-members/:id');
      console.log('  • Articles: /api/articles, /api/articles/:id');
      console.log('  • Locations: /api/locations, /api/locations/:id');
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

import { http, HttpResponse } from 'msw';

export const mockScenarios = {
  // Network errors
  networkError: (endpoint: string) => {
    return worker.use(
      http.all(endpoint, () => {
        return HttpResponse.error();
      })
    );
  },

  // Server errors
  serverError: (endpoint: string) => {
    return worker.use(
      http.all(endpoint, () => {
        return HttpResponse.json(
          { error: 'Internal Server Error' },
          { status: 500 }
        );
      })
    );
  },

  // Slow responses
  slowResponses: (delay: number = 5000) => {
    return worker.use(
      http.all('*', async (info) => {
        await new Promise(resolve => setTimeout(resolve, delay));
        // Pass through to original handler
        return;
      })
    );
  },

  // Authentication errors
  authErrors: () => {
    return worker.use(
      http.all('/api/*', ({ request }) => {
        // Skip auth endpoints
        if (request.url.includes('/api/auth/')) {
          return;
        }

        return HttpResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      })
    );
  },
};

// ================= AUTO-START =================

// Auto-start in development if feature is enabled
if (config.isDevelopment && config.features.enableMockApi) {
  startMockWorker().catch(console.error);
}

// ================= EXPORTS =================

export default worker;
export type { PaginatedResult } from './types';

// src/app/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/global.css';

// Import MSW
import { startMockWorker } from '~/shared/mock/browser';

// Start MSW before rendering
startMockWorker().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

// src/shared/config/env.ts

export const config = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  api: {
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  },

  features: {
    enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
  },

  app: {
    name: import.meta.env.VITE_APP_NAME || 'Team Management',
  },
};

// src/shared/api/query/hooks.ts

import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { config } from '~/shared/config/env';

/**
 * Base fetch function with error handling
 */
const baseFetch = async (url: string, options?: RequestInit) => {
  const response = await fetch(`${config.api.baseUrl}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

/**
 * Remote query hook that makes HTTP requests
 */
export const useRemoteQuery = <TData = unknown>(
  queryKey: any[],
  url: string,
  params?: { params?: Record<string, any>; [key: string]: any },
  options?: UseQueryOptions<TData>,
) => {
  // Build URL with query params
  let fullUrl = url;
  if (params?.params) {
    const searchParams = new URLSearchParams();
    Object.entries(params.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl = `${url}?${queryString}`;
    }
  }

  return useQuery<TData>({
    queryKey,
    queryFn: async () => baseFetch(fullUrl),
    ...options,
  });
};

/**
 * Remote mutation hook that makes HTTP requests
 */
export const useRemoteMutation = <TData = unknown, TVariables = unknown>(
  mutationKey: any[],
  url: string | ((variables: TVariables) => string),
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  params?: any,
  options?: UseMutationOptions<TData, Error, TVariables>,
) => {
  return useMutation<TData, Error, TVariables>({
    mutationKey,
    mutationFn: async (variables) => {
      const finalUrl = typeof url === 'function' ? url(variables) : url;

      return baseFetch(finalUrl, {
        method,
        body: method !== 'DELETE' && variables ? JSON.stringify(variables) : undefined,
      });
    },
    ...options,
  });
};

// src/shared/api/query/type.ts

import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

export type RemoteQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error>,
  'queryKey' | 'queryFn'
>;

export type RemoteMutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  'mutationKey' | 'mutationFn'
>;
