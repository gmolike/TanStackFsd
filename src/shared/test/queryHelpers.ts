/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';

/**
 * Erzeugt ein einfaches Mock-Ergebnis für TanStack Query hooks
 */
export function createMockQuery<TData = unknown, TError = Error>(
  options: {
    data?: TData | null;
    error?: TError | null;
    loading?: boolean;
    success?: boolean;
    [key: string]: any;
  } = {},
): {
  data: TData | null;
  error: TError | null;
  isLoading: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  status: 'loading' | 'error' | 'success';
  fetchStatus: 'fetching' | 'idle';
  refetch: ReturnType<typeof vi.fn>;
  // Weitere Eigenschaften
  [key: string]: any;
} {
  const {
    data = null as TData | null,
    error = null as TError | null,
    loading = false,
    success = !loading && !error,
  } = options;

  return {
    data,
    error,
    isLoading: loading,
    isPending: loading,
    isSuccess: success,
    isError: !!error,
    status: loading ? 'loading' : error ? 'error' : 'success',
    fetchStatus: loading ? 'fetching' : 'idle',

    // Standardwerte für andere Eigenschaften
    refetch: vi.fn().mockResolvedValue({ data }),
    dataUpdatedAt: 0,
    errorUpdateCount: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdatedAt: 0,
    isFetched: !loading,
    isFetchedAfterMount: !loading,
    isFetching: loading,
    isLoadingError: false,
    isRefetchError: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    isInitialLoading: loading,
    isPaused: false,
    promise: Promise.resolve(data),

    // Zusätzliche Eigenschaften, die in options übergeben werden
    ...options,
  };
}

/**
 * Vereinfachter Mock für Mutation-Hooks
 */
export function createMockMutation<TData = unknown, TError = Error>(
  options: {
    data?: TData;
    error?: TError | null;
    loading?: boolean;
    success?: boolean;
    [key: string]: any;
  } = {},
): {
  data: TData | undefined;
  error: TError | null;
  isLoading: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
  status: 'idle' | 'loading' | 'error' | 'success';
  mutate: ReturnType<typeof vi.fn>;
  mutateAsync: ReturnType<typeof vi.fn>;
  reset: ReturnType<typeof vi.fn>;
  // Weitere Eigenschaften
  [key: string]: any;
} {
  const {
    data = undefined as TData | undefined,
    error = null as TError | null,
    loading = false,
    success = !loading && !error && data !== undefined,
  } = options;

  return {
    data,
    error,
    isLoading: loading,
    isPending: loading,
    isSuccess: success,
    isError: !!error,
    isIdle: !loading && !success && !error,
    status: loading ? 'loading' : error ? 'error' : success ? 'success' : 'idle',

    // Funktionen
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockImplementation(() => Promise.resolve(data)),
    reset: vi.fn(),

    // Standardwerte
    variables: undefined,
    context: undefined,

    // Zusätzliche Eigenschaften
    ...options,
  };
}
