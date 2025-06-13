// src/app/providers/AppProvider.tsx
import { StrictMode, Suspense } from 'react';
import type { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AuthProvider } from '~/features/auth/model/AuthContext';
import { config } from '~/shared/config/env';
import { Toaster } from '~/shared/shadcn/toaster';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingSpinner } from '../../shared/shadcn';

// ================= QUERY CLIENT CONFIGURATION =================

const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // React 19 optimized defaults
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount, error: any) => {
          // Don't retry on auth errors
          if (error?.status === 401 || error?.status === 403) {
            return false;
          }
          // Don't retry on client errors (4xx)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: false, // Don't retry mutations by default
        gcTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });
};

// ================= ERROR BOUNDARY =================

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="mx-auto max-w-md rounded-lg border border-destructive bg-card p-6 text-center shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold text-destructive">Etwas ist schiefgelaufen</h2>
      <p className="mb-4 text-muted-foreground">
        {config.isDevelopment ? error.message : 'Ein unerwarteter Fehler ist aufgetreten.'}
      </p>
      {config.isDevelopment && (
        <details className="mb-4 text-left">
          <summary className="cursor-pointer text-sm font-medium">Error Details</summary>
          <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">{error.stack}</pre>
        </details>
      )}
      <button
        onClick={resetErrorBoundary}
        className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Erneut versuchen
      </button>
    </div>
  </div>
);

// ================= LOADING FALLBACK =================

const AppLoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="text-center">
      <LoadingSpinner />
      <p className="text-muted-foreground">Anwendung wird geladen...</p>
    </div>
  </div>
);

// ================= QUERY PROVIDER =================

interface QueryProviderProps extends PropsWithChildren {
  client?: QueryClient;
}

const QueryProvider = ({ children, client }: QueryProviderProps) => {
  // Use provided client or create a new one
  const queryClient = client || createQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {config.features.enableDevtools && !config.isProduction && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" position="bottom" />
      )}
    </QueryClientProvider>
  );
};

// ================= THEME PROVIDER =================

interface ThemeProviderProps extends PropsWithChildren {
  defaultTheme?: 'light' | 'dark' | 'system';
}

const ThemeProvider = ({ children, defaultTheme = 'system' }: ThemeProviderProps) => {
  // This would implement theme switching logic
  // For now, we'll just add the data attribute for CSS
  document.documentElement.setAttribute('data-theme', defaultTheme);

  return <>{children}</>;
};

// ================= MOCK PROVIDER =================

const MockProvider = ({ children }: PropsWithChildren) => {
  // Only enable mocks in development
  if (!config.isDevelopment || !config.features.enableMockApi) {
    return <>{children}</>;
  }

  // MSW setup would go here
  // For now, return children as-is
  return <>{children}</>;
};

// ================= TOAST PROVIDER =================

const ToastProvider = ({ children }: PropsWithChildren) => (
  <>
    {children}
    <Toaster />
  </>
);

// ================= MAIN APP PROVIDER =================

interface AppProviderProps extends PropsWithChildren {
  queryClient?: QueryClient;
  theme?: 'light' | 'dark' | 'system';
}

export const AppProvider = ({ children, queryClient, theme }: AppProviderProps) => {
  return (
    <StrictMode>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, errorInfo) => {
          // Log error to external service in production
          if (config.isProduction && config.services.sentryDsn) {
            console.error('Application Error:', error, errorInfo);
            // Sentry.captureException(error, { contexts: { errorInfo } });
          }
        }}
        onReset={() => {
          // Clear any error state
          window.location.reload();
        }}
      >
        <QueryProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider defaultTheme={theme}>
              <MockProvider>
                <ToastProvider>
                  <Suspense fallback={<AppLoadingFallback />}>{children}</Suspense>
                </ToastProvider>
              </MockProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};

// ================= UTILITY HOOKS =================

/**
 * Hook to access the global query client
 */
export const useAppQueryClient = (): QueryClient => {
  const queryClient = new QueryClient();
  return queryClient;
};

/**
 * Hook to check if app is in development mode
 */
export const useIsDevelopment = (): boolean => {
  return config.isDevelopment;
};

/**
 * Hook to check if a feature is enabled
 */
export const useFeatureFlag = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

// ================= PROVIDER COMPOSITION UTILITIES =================

/**
 * Composes multiple providers into a single component
 */
export const composeProviders = (
  ...providers: Array<React.ComponentType<PropsWithChildren>>
): React.ComponentType<PropsWithChildren> => {
  return ({ children }) => {
    return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);
  };
};

/**
 * Provider for testing purposes
 */
export const TestAppProvider = ({ children, queryClient }: AppProviderProps) => {
  const testQueryClient =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
          staleTime: 0,
        },
        mutations: {
          retry: false,
          gcTime: 0,
        },
      },
    });

  return (
    <QueryProvider client={testQueryClient}>
      <AuthProvider>
        <MockProvider>{children}</MockProvider>
      </AuthProvider>
    </QueryProvider>
  );
};

// ================= DEFAULT EXPORT =================

export default AppProvider;
