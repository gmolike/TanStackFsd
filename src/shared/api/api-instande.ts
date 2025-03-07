// src/shared/api/api-instance.ts
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

import { API_CONFIG } from '~/shared/config/api';

/**
 * Create API instance for use throughout the application
 * Following FSD principles, this is a shared layer module
 */
export const createApiInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    ...config,
  });

  // Request interceptor - can add auth tokens, etc.
  instance.interceptors.request.use(
    (requestConfig) =>
      // You could add authentication here
      // Example: requestConfig.headers.Authorization = `Bearer ${getToken()}`;
      requestConfig,
    (error) => Promise.reject(error),
  );

  // Response interceptor - handle common errors, refresh tokens, etc.
  instance.interceptors.response.use(
    (response) => response,
    async (error) =>
      // Handle common errors (401, 403, etc.)
      // Example: if (error.response?.status === 401) { /* handle token expiration */ }
      Promise.reject(error),
  );

  return instance;
};

// Create and export default instance
export const apiInstance = createApiInstance();

// Export convenience methods that can be used directly
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiInstance.get<T>(url, config).then((response) => response.data),

  post: <T, TData = unknown>(url: string, data?: TData, config?: AxiosRequestConfig): Promise<T> =>
    apiInstance.post<T>(url, data, config).then((response) => response.data),

  put: <T, TData = unknown>(url: string, data?: TData, config?: AxiosRequestConfig): Promise<T> =>
    apiInstance.put<T>(url, data, config).then((response) => response.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiInstance.delete<T>(url, config).then((response) => response.data),
};
