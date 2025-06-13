import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

export type UseRemoteQueryOptions<TData, TError> = Omit<
  UseQueryOptions<TData, TError, TData, QueryKey>,
  'queryKey' | 'queryFn'
>;

/**
 * Ein verbesserter Hook für Remote-Queries mit besserer Typisierung
 */
export function useRemoteQuery<TData, TError = Error>(
  queryKey: QueryKey,
  url: string,
  config?: AxiosRequestConfig,
  options?: UseRemoteQueryOptions<TData, TError>,
): UseQueryResult<TData, TError> {
  // Definieren wir die QueryFunction mit dem korrekten Typen
  const queryFn: QueryFunction<TData, QueryKey> = async () => apiGet<TData>(url, config);

  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
  });
}
