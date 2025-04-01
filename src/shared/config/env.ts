/**
 * Type-safe environment variables access
 * Compatible with your Vite configuration
 */

// Using declaration merging to make TypeScript understand this without import.meta errors
declare global {
  interface Window {
    ENV_RUNTIME?: {
      VITE_API_URL?: string;
      MODE?: string;
      [key: string]: string | undefined;
    };
  }
}

/**
 * Get environment variable from different possible sources
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  // Try direct access first (runtime provided values take precedence)
  if (typeof window !== 'undefined' && window.ENV_RUNTIME && key in window.ENV_RUNTIME) {
    return window.ENV_RUNTIME[key] || defaultValue;
  }

  // For TypeScript to be happy, use a type assertion to work around the import.meta check
  try {
    // @ts-ignore - TypeScript will complain here but it works at runtime with Vite
    const env = import.meta.env;
    const value = env[key];
    return value !== undefined ? value : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Environment information
export const ENV = {
  MODE: getEnv('MODE', 'development'),
  IS_DEV: getEnv('MODE', 'development') === 'development',
  IS_PROD: getEnv('MODE', 'development') === 'production',
  IS_STAGING: getEnv('MODE', 'development') === 'staging',
  API_URL: getEnv('VITE_API_URL', getDefaultApiUrl()),
};

/**
 * Get default API URL based on environment
 */
function getDefaultApiUrl(): string {
  const mode = getEnv('MODE', 'development');
  switch (mode) {
    case 'production':
      return 'https://api.production.com';
    case 'staging':
      return 'https://api.staging.com';
    default:
      return 'http://localhost:8090';
  }
}
