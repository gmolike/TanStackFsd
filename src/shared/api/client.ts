// src/shared/api/client.ts
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

import { env } from '~/shared/config/env';

// ================= TYPES =================

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  retry?: number;
}

// ================= API CLIENT CLASS =================

class ApiClient {
  private static instance: ApiClient;
  private readonly axiosInstance: AxiosInstance;
  private tokenRefreshPromise: Promise<string> | null = null;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: env.VITE_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Füge Auth Token hinzu wenn nicht explizit übersprungen
        if (!config.skipAuth) {
          const token = this.getStoredToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // Entferne custom properties vor dem Request
        delete config.skipAuth;
        delete config.retry;

        return config;
      },
      (error) => Promise.reject(this.createApiError(error)),
    );

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RequestConfig;

        // Handle 401 - Token expired
        if (error.response?.status === 401 && !originalRequest.skipAuth) {
          try {
            const newToken = await this.refreshToken();
            if (newToken && originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(this.createApiError(refreshError as AxiosError));
          }
        }

        return Promise.reject(this.createApiError(error));
      },
    );
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private async refreshToken(): Promise<string> {
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await this.axiosInstance.post<{ accessToken: string }>(
          '/auth/refresh',
          { refreshToken },
          { skipAuth: true },
        );

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        return accessToken;
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw error;
      } finally {
        this.tokenRefreshPromise = null;
      }
    })();

    return this.tokenRefreshPromise;
  }

  private handleAuthError(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Redirect zu Login wenn nicht bereits dort
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  private createApiError(error: AxiosError): ApiError {
    const status = error.response?.status ?? 500;
    const message =
      error.response?.data?.message ?? error.message ?? 'Ein unbekannter Fehler ist aufgetreten';

    return {
      message,
      status,
      code: error.code,
      details: error.response?.data,
    };
  }

  // ================= PUBLIC API METHODS =================

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T, TData = unknown>(url: string, data?: TData, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T, TData = unknown>(url: string, data?: TData, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T, TData = unknown>(url: string, data?: TData, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // Upload mit Progress Tracking
  async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void,
    config?: RequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }

  // Request Cancellation Support
  createCancelToken(): { token: AbortController; cancel: () => void } {
    const controller = new AbortController();
    return {
      token: controller,
      cancel: () => controller.abort(),
    };
  }
}

// ================= EXPORTS =================

export const apiClient = ApiClient.getInstance();

// Legacy exports für Kompatibilität
export const apiGet = <T>(url: string, config?: RequestConfig): Promise<T> =>
  apiClient.get<T>(url, config);

export const apiPost = <T, TData = unknown>(
  url: string,
  data?: TData,
  config?: RequestConfig,
): Promise<T> => apiClient.post<T, TData>(url, data, config);

export const apiPut = <T, TData = unknown>(
  url: string,
  data?: TData,
  config?: RequestConfig,
): Promise<T> => apiClient.put<T, TData>(url, data, config);

export const apiPatch = <T, TData = unknown>(
  url: string,
  data?: TData,
  config?: RequestConfig,
): Promise<T> => apiClient.patch<T, TData>(url, data, config);

export const apiDelete = <T>(url: string, config?: RequestConfig): Promise<T> =>
  apiClient.delete<T>(url, config);

export default apiClient;
