/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { vi } from 'vitest';

/**
 * Erzeugt ein typsicheres Mock-Ergebnis für TanStack Query Hooks
 */
export function createMockQuery<TData = unknown, TError = Error>(
  options: {
    data?: TData | undefined;
    error?: TError | null;
    loading?: boolean;
    success?: boolean;
    [key: string]: any;
  } = {},
): UseQueryResult<TData, TError> {
  const {
    data = undefined as TData | undefined,
    error = null as TError | null,
    loading = false,
    success = !loading && !error && data !== undefined,
  } = options;

  // Korrekt typisiertes Promise
  const typesafePromise: Promise<TData> = Promise.resolve(data || ({} as TData));

  // Basisobjekt für QueryObserverResult
  const result = {
    data,
    error, // Wir belassen es bei TError | null, da wir später as any casten
    isLoading: loading,
    isPending: loading,
    isSuccess: success,
    isError: !!error,
    status: loading ? 'pending' : error ? 'error' : 'success',
    fetchStatus: loading ? 'fetching' : 'idle',
    refetch: vi.fn().mockResolvedValue({ data }),

    // Weitere notwendige Eigenschaften für TanStack Query v5
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

    // Korrekt typisiertes Promise
    promise: typesafePromise,
  };

  // Füge weitere Eigenschaften hinzu (ohne die verarbeiteten)
  for (const key in options) {
    if (key !== 'data' && key !== 'error' && key !== 'loading' && key !== 'success') {
      (result as Record<string, any>)[key] = options[key];
    }
  }

  // Wir casten das gesamte Ergebnis, um Typprobleme zu umgehen
  return result as unknown as UseQueryResult<TData, TError>;
}

/**
 * Erzeugt ein typsicheres Mock-Ergebnis für TanStack Mutation Hooks
 */
export function createMockMutation<TData = unknown, TVariables = unknown, TError = Error>(
  options: {
    data?: TData | undefined;
    error?: TError | null;
    loading?: boolean;
    success?: boolean;
    [key: string]: any;
  } = {},
): UseMutationResult<TData, TError, TVariables, unknown> {
  const {
    data = undefined as TData | undefined,
    error = null as TError | null,
    loading = false,
    success = !loading && !error && data !== undefined,
  } = options;

  // Status basierend auf den Parametern ableiten
  const status = loading ? 'loading' : error ? 'error' : success ? 'success' : 'idle';

  // Basisobjekt für UseMutationResult
  const result = {
    data,
    error,
    isLoading: loading,
    isPending: loading,
    isSuccess: success,
    isError: !!error,
    isIdle: status === 'idle',
    status,

    // Funktionen
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockImplementation(() => Promise.resolve(data || ({} as TData))),
    reset: vi.fn(),

    // Weitere Eigenschaften
    variables: undefined as TVariables | undefined,
    context: undefined,
  };

  // Füge weitere Eigenschaften hinzu (ohne die verarbeiteten)
  for (const key in options) {
    if (key !== 'data' && key !== 'error' && key !== 'loading' && key !== 'success') {
      (result as Record<string, any>)[key] = options[key];
    }
  }

  return result as unknown as UseMutationResult<TData, TError, TVariables, unknown>;
}
