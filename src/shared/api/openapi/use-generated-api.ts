// src/shared/api/openapi/use-generated-api.ts
import type {
  MutationKey,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

/**
 * Ein Hook für generierte OpenAPI Query-Funktionen
 *
 * Dieser Hook soll mit den von OpenAPI-Generator erzeugten Funktionen verwendet werden
 */
export function useGeneratedQuery<
  TData,
  TError = Error,
  TQueryFnData = TData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: Omit<UseQueryOptions<TData, TError, TQueryFnData, TQueryKey>, 'queryKey' | 'queryFn'>,
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TQueryFnData, TQueryKey>({
    queryKey,
    queryFn,
    ...options,
  });
}

/**
 * Ein Hook für generierte OpenAPI Mutation-Funktionen
 *
 * Dieser Hook soll mit den von OpenAPI-Generator erzeugten Funktionen verwendet werden
 */
export function useGeneratedMutation<
  TData,
  TVariables,
  TError = Error,
  TContext = unknown,
  TMutationKey extends MutationKey = MutationKey,
>(
  mutationKey: TMutationKey,
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationKey' | 'mutationFn'
  >,
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationKey,
    mutationFn,
    ...options,
  });
}

// Beispiel für die Nutzung mit generierten APIs
/*
  // src/entities/user/api/user-api.ts
  import { UserApi, Configuration, User, CreateUserDto } from '@/shared/api/generated';
  import { useGeneratedQuery, useGeneratedMutation } from '@/shared/api/openapi/use-generated-api';
  
  const apiConfig = new Configuration({
    basePath: import.meta.env.VITE_API_BASE_URL,
    accessToken: () => localStorage.getItem('accessToken') || ''
  });
  
  const userApi = new UserApi(apiConfig);
  
  export const useUsers = (options?: any) => {
    return useGeneratedQuery(
      ['users'],
      () => userApi.getUsers(),
      options
    );
  };
  
  export const useUserById = (userId: string, options?: any) => {
    return useGeneratedQuery(
      ['users', userId],
      () => userApi.getUserById(userId),
      options
    );
  };
  
  export const useCreateUser = (options?: any) => {
    return useGeneratedMutation(
      ['users', 'create'],
      (newUser: CreateUserDto) => userApi.createUser(newUser),
      options
    );
  };
  */
