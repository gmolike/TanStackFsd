import type {
  MutationKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { apiDelete, apiPatch, apiPost, apiPut } from '../api-client';

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type UseRemoteMutationOptions<TData, TVariables, TError, TContext> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationKey' | 'mutationFn'
>;

/**
 * Ein verbesserter Hook für Remote-Mutations mit besserer Typisierung
 */
export function useRemoteMutation<TData, TVariables, TError = Error, TContext = unknown>(
  mutationKey: MutationKey,
  url: string,
  method: HttpMethod = 'POST',
  config?: AxiosRequestConfig,
  options?: UseRemoteMutationOptions<TData, TVariables, TError, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const mutationFn = async (variables: TVariables): Promise<TData> => {
    switch (method) {
      case 'POST':
        return apiPost<TData, TVariables>(url, variables, config);
      case 'PUT':
        return apiPut<TData, TVariables>(url, variables, config);
      case 'PATCH':
        return apiPatch<TData, TVariables>(url, variables, config);
      case 'DELETE':
        return apiDelete<TData>(url, { ...config, data: variables });
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  };

  return useMutation<TData, TError, TVariables, TContext>({
    mutationKey,
    mutationFn,
    ...options,
  });
}

export type QueryHookResult<TData> = UseQueryResult<TData, Error>;
export type MutationHookResult<TData, TVariables> = UseMutationResult<TData, Error, TVariables>;
export type RemoteMutationOptions<TData, TVariables> = UseRemoteMutationOptions<
  TData,
  TVariables,
  Error,
  unknown
>;
