import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

// Basis-API-Konfiguration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor für Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor für globale Fehlerbehandlung
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Hier kann Token-Refresh-Logik hinzugefügt werden
    if (error.response?.status === 401) {
      // Token abgelaufen? Refresh Token Logic oder Logout
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Typsichere Request-Methoden
export const apiGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.get(url, config);
  return response.data;
};

export const apiPost = async <T, TData = unknown>(
  url: string,
  data?: TData,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.post(url, data, config);
  return response.data;
};

export const apiPut = async <T, TData = unknown>(
  url: string,
  data?: TData,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.put(url, data, config);
  return response.data;
};

export const apiPatch = async <T, TData = unknown>(
  url: string,
  data?: TData,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
  return response.data;
};

export const apiDelete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.delete(url, config);
  return response.data;
};

export default apiClient;
