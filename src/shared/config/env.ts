// src/shared/config/env.ts

// ================= ENVIRONMENT VARIABLES =================

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_ENABLE_MOCK_API: string;
  readonly VITE_ENABLE_DEVTOOLS: string;
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_BUILD_SOURCEMAP: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_POSTHOG_KEY?: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// ================= CONFIGURATION TYPE =================

export interface AppConfig {
  // Basic info
  appName: string;
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;

  // Features
  features: {
    enableMockApi: boolean;
    enableDevtools: boolean;
    debugMode: boolean;
    enableAnalytics: boolean;
    enableErrorTracking: boolean;
  };

  // External services
  services: {
    googleAnalyticsId?: string;
    sentryDsn?: string;
    posthogKey?: string;
  };

  // Build info
  build: {
    version: string;
    buildTime: string;
    commitHash: string;
    enableSourcemap: boolean;
  };
}

// ================= HELPER FUNCTIONS =================

const getEnvironment = (): AppConfig['environment'] => {
  if (import.meta.env.PROD) return 'production';
  if (import.meta.env.MODE === 'staging') return 'staging';
  return 'development';
};

const parseBoolean = (value: string | undefined, defaultValue = false): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Define additional env variables that will be injected at build time
declare global {
  const __APP_VERSION__: string;
  const __BUILD_TIME__: string;
  const __COMMIT_HASH__: string;
}

// ================= CONFIGURATION =================

export const config: AppConfig = {
  // Basic info
  appName: import.meta.env.VITE_APP_NAME || 'FSD App',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  environment: getEnvironment(),
  isDevelopment: import.meta.env.DEV,
  isStaging: import.meta.env.MODE === 'staging',
  isProduction: import.meta.env.PROD,

  // Features
  features: {
    enableMockApi: parseBoolean(import.meta.env.VITE_ENABLE_MOCK_API, true),
    enableDevtools: parseBoolean(import.meta.env.VITE_ENABLE_DEVTOOLS, !import.meta.env.PROD),
    debugMode: parseBoolean(import.meta.env.VITE_DEBUG_MODE, import.meta.env.DEV),
    enableAnalytics: parseBoolean(
      import.meta.env.VITE_GOOGLE_ANALYTICS_ID || import.meta.env.VITE_POSTHOG_KEY,
    ),
    enableErrorTracking: parseBoolean(import.meta.env.VITE_SENTRY_DSN),
  },

  // External services
  services: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    posthogKey: import.meta.env.VITE_POSTHOG_KEY,
  },

  // Build info - use the globals if available, otherwise fallback
  build: {
    version: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0',
    buildTime: typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString(),
    commitHash: typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'unknown',
    enableSourcemap: parseBoolean(import.meta.env.VITE_BUILD_SOURCEMAP, import.meta.env.DEV),
  },
} as const;

// ================= VALIDATION =================

// Validate required environment variables
const validateConfig = (): void => {
  const errors: string[] = [];

  if (!import.meta.env.VITE_API_URL && config.isProduction) {
    errors.push('VITE_API_URL is required in production');
  }

  if (errors.length > 0) {
    const errorMessage = `Environment validation failed:\n${errors.join('\n')}`;
    console.error(errorMessage);

    if (config.isProduction) {
      throw new Error(errorMessage);
    }
  }
};

// Run validation
validateConfig();

// ================= EXPORTS =================

export default config;

// Re-export environment helpers
export const isDevelopment = config.isDevelopment;
export const isStaging = config.isStaging;
export const isProduction = config.isProduction;
export const environment = config.environment;
