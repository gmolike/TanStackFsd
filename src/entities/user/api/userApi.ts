// src/entities/user/api/userApi.ts
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '~/shared/api/client';

import type {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  User,
  UserProfileResponse,
  UsersQueryParams,
  UsersResponse,
} from '../model/types';

// ================= QUERY KEYS =================

export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (params: UsersQueryParams) => [...userQueryKeys.lists(), params] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
  profile: (id: string) => [...userQueryKeys.detail(id), 'profile'] as const,
  current: () => [...userQueryKeys.all, 'current'] as const,
} as const;

// ================= API FUNCTIONS =================

const userApi = {
  // Get single user
  getUser: async (id: string): Promise<User> => apiClient.get<User>(`/users/${id}`),

  // Get users with pagination and filters
  getUsers: async (params: UsersQueryParams = {}): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v.toString()));
          } else {
            searchParams.set(key, value.toString());
          }
        }
      });
    }
    if (params.sort) {
      searchParams.set('sortField', params.sort.field);
      searchParams.set('sortDirection', params.sort.direction);
    }
    if (params.include) {
      params.include.forEach((include) => searchParams.append('include', include));
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/users?${queryString}` : '/users';

    return apiClient.get<UsersResponse>(url);
  },

  // Get user profile (extended information)
  getUserProfile: async (id: string): Promise<UserProfileResponse> =>
    apiClient.get<UserProfileResponse>(`/users/${id}/profile`),

  // Get current user
  getCurrentUser: async (): Promise<User> => apiClient.get<User>('/users/me'),

  // Create user
  createUser: async (data: CreateUserDto): Promise<User> => apiClient.post<User>('/users', data),

  // Update user
  updateUser: async (id: string, data: UpdateUserDto): Promise<User> =>
    apiClient.put<User>(`/users/${id}`, data),

  // Update current user
  updateCurrentUser: async (data: UpdateUserDto): Promise<User> =>
    apiClient.put<User>('/users/me', data),

  // Update user password
  updateUserPassword: async (id: string, data: UpdateUserPasswordDto): Promise<void> =>
    apiClient.put<void>(`/users/${id}/password`, data),

  // Update current user password
  updateCurrentUserPassword: async (data: UpdateUserPasswordDto): Promise<void> =>
    apiClient.put<void>('/users/me/password', data),

  // Update user email
  updateUserEmail: async (id: string, data: UpdateUserEmailDto): Promise<User> =>
    apiClient.put<User>(`/users/${id}/email`, data),

  // Update current user email
  updateCurrentUserEmail: async (data: UpdateUserEmailDto): Promise<User> =>
    apiClient.put<User>('/users/me/email', data),

  // Delete user
  deleteUser: async (id: string): Promise<void> => apiClient.delete<void>(`/users/${id}`),

  // Upload avatar
  uploadAvatar: async (
    id: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiClient.upload<{ avatarUrl: string }>(`/users/${id}/avatar`, formData, onProgress);
  },

  // Upload current user avatar
  uploadCurrentUserAvatar: async (
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiClient.upload<{ avatarUrl: string }>('/users/me/avatar', formData, onProgress);
  },
} as const;

// ================= QUERY HOOKS =================

export const useUser = (
  id: string,
  options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

export const useUsers = (
  params: UsersQueryParams = {},
  options?: Omit<UseQueryOptions<UsersResponse, Error>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: () => userApi.getUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });

export const useUserProfile = (
  id: string,
  options?: Omit<UseQueryOptions<UserProfileResponse, Error>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: userQueryKeys.profile(id),
    queryFn: () => userApi.getUserProfile(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

export const useCurrentUser = (
  options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: userQueryKeys.current(),
    queryFn: userApi.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });

// ================= MUTATION HOOKS =================

export const useCreateUser = (options?: UseMutationOptions<User, Error, CreateUserDto>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: (data, variables) => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });

      // Set user data in cache
      queryClient.setQueryData(userQueryKeys.detail(data.id), data);

      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
};

export const useUpdateUser = (
  options?: UseMutationOptions<User, Error, { id: string; data: UpdateUserDto }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: (data, variables) => {
      // Update user in cache
      queryClient.setQueryData(userQueryKeys.detail(variables.id), data);

      // Invalidate profile if it exists
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profile(variables.id) });

      // Invalidate users lists
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });

      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
};

export const useUpdateCurrentUser = (options?: UseMutationOptions<User, Error, UpdateUserDto>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateCurrentUser,
    onSuccess: (data, variables) => {
      // Update current user in cache
      queryClient.setQueryData(userQueryKeys.current(), data);
      queryClient.setQueryData(userQueryKeys.detail(data.id), data);

      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
};

export const useUpdateUserPassword = (
  options?: UseMutationOptions<void, Error, { id: string; data: UpdateUserPasswordDto }>,
) =>
  useMutation({
    mutationFn: ({ id, data }) => userApi.updateUserPassword(id, data),
    ...options,
  });

export const useUpdateCurrentUserPassword = (
  options?: UseMutationOptions<void, Error, UpdateUserPasswordDto>,
) =>
  useMutation({
    mutationFn: userApi.updateCurrentUserPassword,
    ...options,
  });

export const useUpdateUserEmail = (
  options?: UseMutationOptions<User, Error, { id: string; data: UpdateUserEmailDto }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => userApi.updateUserEmail(id, data),
    onSuccess: (data, variables) => {
      // Update user in cache
      queryClient.setQueryData(userQueryKeys.detail(variables.id), data);

      // Invalidate users lists (email might affect search/filter)
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });

      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
};

export const useUpdateCurrentUserEmail = (
  options?: UseMutationOptions<User, Error, UpdateUserEmailDto>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateCurrentUserEmail,
    onSuccess: (data, variables) => {
      // Update current user in cache
      queryClient.setQueryData(userQueryKeys.current(), data);
      queryClient.setQueryData(userQueryKeys.detail(data.id), data);

      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
};

export const useDeleteUser = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: (data, userId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userQueryKeys.detail(userId) });
      queryClient.removeQueries({ queryKey: userQueryKeys.profile(userId) });

      // Invalidate users lists
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });

      options?.onSuccess?.(data, userId, undefined);
    },
    ...options,
  });
};

export const useUploadUserAvatar = (
  options?: UseMutationOptions<
    { avatarUrl: string },
    Error,
    { id: string; file: File; onProgress?: (progress: number) => void }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file, onProgress }) => userApi.uploadAvatar(id, file, onProgress),
    onSuccess: (data, variables) => {
      // Update user avatar in cache
      const userQueryKey = userQueryKeys.detail(variables.id);
      queryClient.setQueryData(userQueryKey, (oldData: User | undefined) => {
        if (oldData) {
          return { ...oldData, avatar: data.avatarUrl };
        }
        return oldData;
      });

      // Invalidate profile
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profile(variables.id) });

      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
};

export const useUploadCurrentUserAvatar = (
  options?: UseMutationOptions<
    { avatarUrl: string },
    Error,
    { file: File; onProgress?: (progress: number) => void }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, onProgress }) => userApi.uploadCurrentUserAvatar(file, onProgress),
    onSuccess: (data, variables) => {
      // Update current user avatar in cache
      queryClient.setQueryData(userQueryKeys.current(), (oldData: User | undefined) => {
        if (oldData) {
          const updatedUser = { ...oldData, avatar: data.avatarUrl };

          // Also update in detail cache
          queryClient.setQueryData(userQueryKeys.detail(oldData.id), updatedUser);

          return updatedUser;
        }
        return oldData;
      });

      options?.onSuccess?.(data, variables, undefined);
    },
    ...options,
  });
};
