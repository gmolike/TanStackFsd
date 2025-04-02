import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as apiClient from '../../api-client';
import { useRemoteQuery } from '../use-remote-query';

// Mock der apiGet Funktion
vi.mock('../../api-client', () => ({
  apiGet: vi.fn(),
}));

// Typdefinition für unsere Test-Daten
interface TestUser {
  id: string;
  name: string;
  email: string;
}

describe('useRemoteQuery', () => {
  // Erstellen eines frischen QueryClient für jeden Test
  let queryClient: QueryClient;

  // Vor jedem Test einen neuen QueryClient erstellen
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // Deaktiviere Retries für Tests, um schnellere Failures zu bekommen
          retry: false,
          // Keine Caching-Strategie im Test
          gcTime: 0,
          staleTime: 0,
        },
      },
    });
  });

  // Nach jedem Test Mocks zurücksetzen
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Wrapper-Komponente für den QueryClientProvider
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  // Der eigentliche Test für einen erfolgreichen API-Call
  it('should fetch and return data successfully', async () => {
    // Mock-Daten, die von der API zurückgegeben werden sollen
    const mockUser: TestUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };

    // Mock der apiGet-Funktion, um die Mock-Daten zurückzugeben
    const apiGetMock = vi.mocked(apiClient.apiGet);
    apiGetMock.mockResolvedValueOnce(mockUser);

    // Hook rendern mit dem QueryClientProvider Wrapper
    const { result } = renderHook(
      () =>
        useRemoteQuery<TestUser>(['user', '1'], '/users/1', {
          headers: { 'Content-Type': 'application/json' },
        }),
      { wrapper },
    );

    // Initial sollte es laden
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Warten bis der asynchrone Vorgang abgeschlossen ist
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Überprüfen ob die Daten korrekt zurückgegeben wurden
    expect(result.current.data).toEqual(mockUser);
    expect(result.current.error).toBeNull();

    // Überprüfen ob die apiGet-Funktion korrekt aufgerufen wurde
    expect(apiGetMock).toHaveBeenCalledTimes(1);
    expect(apiGetMock).toHaveBeenCalledWith('/users/1', {
      headers: { 'Content-Type': 'application/json' },
    });
  });

  // Test für einen fehlgeschlagenen API-Call
  it('should handle error when API call fails', async () => {
    // Error-Objekt, das von der API geworfen werden soll
    const mockError = new Error('Failed to fetch user');

    // Mock der apiGet-Funktion, um einen Fehler zu werfen
    const apiGetMock = vi.mocked(apiClient.apiGet);
    apiGetMock.mockRejectedValueOnce(mockError);

    // Hook rendern mit dem QueryClientProvider Wrapper
    const { result } = renderHook(() => useRemoteQuery<TestUser>(['user', '1'], '/users/1'), {
      wrapper,
    });

    // Initial sollte es laden
    expect(result.current.isLoading).toBe(true);

    // Warten bis der asynchrone Vorgang abgeschlossen ist
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Überprüfen ob der Fehler korrekt zurückgegeben wurde
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Failed to fetch user');

    // Überprüfen ob die apiGet-Funktion korrekt aufgerufen wurde
    expect(apiGetMock).toHaveBeenCalledTimes(1);
    expect(apiGetMock).toHaveBeenCalledWith('/users/1', undefined);
  });

  // Test für bedingte Ausführung mit enabled: false
  it('should not fetch data when enabled is false', async () => {
    // Mock der apiGet-Funktion
    const apiGetMock = vi.mocked(apiClient.apiGet);

    // Hook rendern mit enabled: false
    const { result } = renderHook(
      () => useRemoteQuery<TestUser>(['user', '1'], '/users/1', undefined, { enabled: false }),
      { wrapper },
    );

    // Es sollte nicht laden, da enabled: false
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();

    // Warten um sicherzustellen, dass kein API-Call ausgeführt wird
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Überprüfen ob die apiGet-Funktion nicht aufgerufen wurde
    expect(apiGetMock).not.toHaveBeenCalled();
  });

  // Test für das Refetching von Daten
  it('should refetch data when refetch is called', async () => {
    // Mock-Daten, die von der API zurückgegeben werden sollen
    const mockUserInitial: TestUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };

    const mockUserUpdated: TestUser = {
      id: '1',
      name: 'Updated User',
      email: 'updated@example.com',
    };

    // Mock der apiGet-Funktion für erste und zweite Anfrage
    const apiGetMock = vi.mocked(apiClient.apiGet);
    apiGetMock.mockResolvedValueOnce(mockUserInitial);
    apiGetMock.mockResolvedValueOnce(mockUserUpdated);

    // Hook rendern
    const { result } = renderHook(() => useRemoteQuery<TestUser>(['user', '1'], '/users/1'), {
      wrapper,
    });

    // Warten auf den ersten API-Call
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Überprüfen der Ergebnisse des ersten Aufrufs
    expect(result.current.data).toEqual(mockUserInitial);
    expect(apiGetMock).toHaveBeenCalledTimes(1);

    // Manuelles Refetching auslösen
    result.current.refetch();

    // Warten auf den zweiten API-Call
    await waitFor(() => {
      expect(result.current.data).toEqual(mockUserUpdated);
    });

    // Überprüfen ob die apiGet-Funktion zweimal aufgerufen wurde
    expect(apiGetMock).toHaveBeenCalledTimes(2);
  });
});
