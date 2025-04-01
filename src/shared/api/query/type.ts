import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

import type { UseRemoteMutationOptions } from './use-remote-mutation';
import type { UseRemoteQueryOptions } from './use-remote-query';

export type QueryHookResult<TData> = UseQueryResult<TData, Error>;
export type MutationHookResult<TData, TVariables> = UseMutationResult<TData, Error, TVariables>;
export type RemoteQueryOptions<TData> = UseRemoteQueryOptions<TData, Error>;
export type RemoteMutationOptions<TData, TVariables> = UseRemoteMutationOptions<
  TData,
  TVariables,
  Error,
  unknown
>;
