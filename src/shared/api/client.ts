// src/shared/api/client.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { config } from '~/shared/config/env';

// ================= TYPES =================

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export interface ApiRequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean;
  customHeaders?: Record<string, string>;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ================= TOKEN MANAGEMENT =================

class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}

// ================= API CLIENT CLASS =================

class ApiClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // ================= INTERCEPTORS =================

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (axiosConfig) => {
        const token = TokenManager.getAccessToken();

        if (token && !axiosConfig.skipAuth) {
          axiosConfig.headers.Authorization = `Bearer ${token}`;
        }

        // Add custom headers if provided
        if (axiosConfig.customHeaders) {
          Object.assign(axiosConfig.headers, axiosConfig.customHeaders);
        }

        // Log request in development
        if (config.isDevelopment) {
          console.log(
            `🚀 ${axiosConfig.method?.toUpperCase()} ${axiosConfig.url}`,
            axiosConfig.data,
          );
        }

        return axiosConfig;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Log response in development
        if (config.isDevelopment) {
          console.log(
            `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
            response.data,
          );
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.skipAuth
        ) {
          originalRequest._retry = true;

          if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
              const refreshToken = TokenManager.getRefreshToken();
              if (!refreshToken) {
                throw new Error('No refresh token available');
              }

              const response = await this.refreshToken(refreshToken);
              const { accessToken, refreshToken: newRefreshToken } = response;

              TokenManager.setTokens(accessToken, newRefreshToken);
              this.onRefreshed(accessToken);

              return this.axiosInstance(originalRequest);
            } catch (refreshError) {
              this.onRefreshFailed();
              TokenManager.clearTokens();

              // Redirect to login
              window.location.href = '/login';

              return Promise.reject(refreshError);
            } finally {
              this.isRefreshing = false;
            }
          }

          // Wait for token refresh
          return new Promise((resolve) => {
            this.subscribeTokenRefresh((token: string) => {
              originalRequest.headers!.Authorization = `Bearer ${token}`;
              resolve(this.axiosInstance(originalRequest));
            });
          });
        }

        // Handle other errors
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          status: error.response?.status,
          code: error.response?.data?.code,
          details: error.response?.data,
        };

        // Log error in development
        if (config.isDevelopment) {
          console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, apiError);
        }

        return Promise.reject(apiError);
      },
    );
  }

  // ================= TOKEN REFRESH LOGIC =================

  private async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await axios.post<RefreshTokenResponse>(
      `${config.apiUrl}/auth/refresh`,
      { refreshToken },
      { skipAuth: true } as AxiosRequestConfig,
    );
    return response.data;
  }

  private subscribeTokenRefresh(cb: (token: string) => void): void {
    this.refreshSubscribers.push(cb);
  }

  private onRefreshed(token: string): void {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private onRefreshFailed(): void {
    this.refreshSubscribers = [];
  }

  // ================= HTTP METHODS =================

  async get<T = any>(url: string, options?: ApiRequestOptions): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, options);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, options);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, options);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, options?: ApiRequestOptions): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, options);
    return response.data;
  }

  async delete<T = any>(url: string, options?: ApiRequestOptions): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, options);
    return response.data;
  }

  // ================= FILE UPLOAD =================

  async upload<T = any>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void,
    options?: ApiRequestOptions,
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, formData, {
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options?.headers,
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

  // ================= DOWNLOAD =================

  async download(url: string, filename: string, options?: ApiRequestOptions): Promise<void> {
    const response = await this.axiosInstance.get(url, {
      ...options,
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  // ================= UTILITIES =================

  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// ================= SINGLETON INSTANCE =================

export const apiClient = new ApiClient();

// ================= EXPORTS =================

export default apiClient;

// Re-export axios types for convenience
export type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
