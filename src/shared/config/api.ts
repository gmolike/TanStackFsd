import { ENV } from './env';

// API configuration
export const API_CONFIG = {
  BASE_URL: ENV.API_URL,
  TIMEOUT: 30000, // 30 seconds default timeout
  RETRY_COUNT: 3,
};

/**
 * Get API endpoint URL with optional path
 */
export function getApiEndpoint(path: string = ''): string {
  return `${API_CONFIG.BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Configure API instance with options
 * This can be expanded with authentication, interceptors, etc.
 */
export function configureApi(): {
  baseURL: string;
  timeout: number;
  headers: { 'Content-Type': string };
} {
  // Here you could set up axios, fetch, or any API client
  // Example with options specific to your FSD architecture
  return {
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
