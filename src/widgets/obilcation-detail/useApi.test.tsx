import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useObligationDetail } from 'entities/clients/api/useQuery';
import { obligationDetailMapper } from 'entities/obligations';
import { useApi } from '../useApi';

// Mock the dependencies
vi.mock('entities/clients/api/useQuery', () => ({
  useObligationDetail: vi.fn(),
}));

vi.mock('entities/obligations', () => ({
  obligationDetailMapper: {
    toFrontendType: vi.fn((dto) => ({ ...dto, transformed: true })),
  },
}));

describe('useApi hook', () => {
  // Create a wrapper with QueryClientProvider
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it('should return loading state when data is being fetched', () => {
    vi.mocked(useObligationDetail).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    const { result } = renderHook(() => useApi('client-id', 'obligation-id'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.obligationDetail).toBeUndefined();
  });

  it('should return error state when fetch fails', () => {
    vi.mocked(useObligationDetail).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    const { result } = renderHook(() => useApi('client-id', 'obligation-id'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isError).toBe(true);
  });

  it('should transform fetched data with the mapper', async () => {
    const mockDto = { id: '123', someField: 'value' };
    vi.mocked(useObligationDetail).mockReturnValue({
      data: mockDto,
      isLoading: false,
      isError: false,
    } as any);

    vi.mocked(obligationDetailMapper.toFrontendType).mockReturnValue({
      id: '123',
      someField: 'value',
      obligatedPersonId: 'person-id',
      transformed: true,
    });

    const { result } = renderHook(() => useApi('client-id', 'obligation-id'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.obligationDetail).toEqual({
        id: '123',
        someField: 'value',
        obligatedPersonId: 'person-id',
        transformed: true,
      });
      expect(result.current.personId).toBe('person-id');
    });

    expect(obligationDetailMapper.toFrontendType).toHaveBeenCalledWith(mockDto);
  });
});
