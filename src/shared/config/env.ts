// src/shared/config/env.ts
import { z } from 'zod';

// ================= SCHEMA DEFINITION =================

const envSchema = z.object({
  // API Configuration
  VITE_API_URL: z.string().url('VITE_API_URL must be a valid URL').default('http://localhost:8090'),

  // App Configuration
  VITE_APP_NAME: z.string().default('FSD React App'),
  VITE_APP_VERSION: z.string().optional(),

  // Environment
  MODE: z.enum(['development', 'staging', 'production']).default('development'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Feature Flags
  VITE_FEATURE_NEW_DASHBOARD: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  VITE_FEATURE_BETA_FEATURES: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  VITE_ENABLE_MOCK_API: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),

  // External Services
  VITE_SENTRY_DSN: z.string().url().optional(),
  VITE_GOOGLE_ANALYTICS_ID: z.string().optional(),
  VITE_POSTHOG_KEY: z.string().optional(),

  // Development
  VITE_ENABLE_DEVTOOLS: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),
  VITE_DEBUG_MODE: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),

  // Testing
  VITE_TEST_BASE_URL: z.string().url().optional(),
  VITE_TEST_TIMEOUT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive())
    .default('30000'),

  // Build Configuration
  VITE_BUILD_ANALYZE: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  VITE_BUILD_SOURCEMAP: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),
});

// ================= TYPE DEFINITIONS =================

export type Environment = z.infer<typeof envSchema>;

export type EnvironmentMode = Environment['MODE'];

export interface RuntimeConfig {
  apiUrl: string;
  appName: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  features: {
    newDashboard: boolean;
    betaFeatures: boolean;
    enableMockApi: boolean;
    enableDevtools: boolean;
    debugMode: boolean;
  };
  services: {
    sentryDsn?: string;
    googleAnalyticsId?: string;
    posthogKey?: string;
  };
  testing: {
    baseUrl?: string;
    timeout: number;
  };
  build: {
    analyze: boolean;
    sourcemap: boolean;
  };
}

// ================= UTILITY FUNCTIONS =================

function getEnvironmentVariables(): Record<string, string | undefined> {
  // Unterstützung für verschiedene Runtime-Umgebungen
  if (typeof window !== 'undefined' && window.ENV_RUNTIME) {
    return window.ENV_RUNTIME;
  }

  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env as Record<string, string | undefined>;
  }

  if (typeof process !== 'undefined' && process.env) {
    return process.env;
  }

  return {};
}

function parseEnvironment(): Environment {
  const rawEnv = getEnvironmentVariables();

  try {
    return envSchema.parse(rawEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);

      console.error('Environment validation failed:', issues);

      // In development, throw error
      if (rawEnv.NODE_ENV === 'development') {
        throw new Error(`Environment validation failed:\n${issues.join('\n')}`);
      }

      // In production, log error but continue with defaults
      console.warn('Using default environment values due to validation errors');
      return envSchema.parse({});
    }

    throw error;
  }
}

// ================= MAIN EXPORT =================

const parsedEnv = parseEnvironment();

export const env: Environment = parsedEnv;

export const config: RuntimeConfig = {
  apiUrl: env.VITE_API_URL,
  appName: env.VITE_APP_NAME,
  isDevelopment: env.MODE === 'development',
  isProduction: env.MODE === 'production',
  isTest: env.NODE_ENV === 'test',
  features: {
    newDashboard: env.VITE_FEATURE_NEW_DASHBOARD,
    betaFeatures: env.VITE_FEATURE_BETA_FEATURES,
    enableMockApi: env.VITE_ENABLE_MOCK_API,
    enableDevtools: env.VITE_ENABLE_DEVTOOLS,
    debugMode: env.VITE_DEBUG_MODE,
  },
  services: {
    sentryDsn: env.VITE_SENTRY_DSN,
    googleAnalyticsId: env.VITE_GOOGLE_ANALYTICS_ID,
    posthogKey: env.VITE_POSTHOG_KEY,
  },
  testing: {
    baseUrl: env.VITE_TEST_BASE_URL,
    timeout: env.VITE_TEST_TIMEOUT,
  },
  build: {
    analyze: env.VITE_BUILD_ANALYZE,
    sourcemap: env.VITE_BUILD_SOURCEMAP,
  },
};

// ================= DEVELOPMENT HELPERS =================

if (config.isDevelopment && config.features.debugMode) {
  console.group('🔧 Environment Configuration');
  console.log('Mode:', env.MODE);
  console.log('API URL:', config.apiUrl);
  console.log('Features:', config.features);
  console.log('Services:', config.services);
  console.groupEnd();
}

// ================= TYPE GUARDS =================

export const isValidEnvironment = (mode: string): mode is EnvironmentMode => {
  return ['development', 'staging', 'production'].includes(mode);
};

export const isFeatureEnabled = (feature: keyof RuntimeConfig['features']): boolean => {
  return config.features[feature];
};

// ================= GLOBAL TYPE AUGMENTATION =================

declare global {
  interface Window {
    ENV_RUNTIME?: Record<string, string>;
    __APP_CONFIG__?: RuntimeConfig;
  }
}

// Make config available globally for debugging
if (typeof window !== 'undefined' && config.isDevelopment) {
  window.__APP_CONFIG__ = config;
}
