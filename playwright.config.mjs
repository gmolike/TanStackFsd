import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES Module dirname equivalent
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration helpers
const getEnvConfig = () => {
  const mode = process.env.NODE_ENV || 'development';
  const env = loadEnv(mode, process.cwd(), '');

  return {
    mode,
    env,
    isCI: !!env.CI,
    baseURL:
      env.VITE_TEST_BASE_URL ||
      (env.CI_APP_NAME
        ? `http://${env.CI_APP_NAME}:8080`
        : env.VITE_DEV_SERVER_URL || 'http://localhost:8090'),
  };
};

// Get browser configurations
const getBrowserProjects = (config) => {
  const standardBrowsers = [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ];

  const mobileBrowsers =
    config.env.VITE_INCLUDE_MOBILE_TESTS === 'true'
      ? [
          {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
          },
          {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
          },
        ]
      : [];

  const brandedBrowsers =
    config.env.VITE_INCLUDE_BRANDED_BROWSERS === 'true'
      ? [
          {
            name: 'Microsoft Edge',
            use: { ...devices['Desktop Edge'], channel: 'msedge' },
          },
          {
            name: 'Google Chrome',
            use: { ...devices['Desktop Chrome'], channel: 'chrome' },
          },
        ]
      : [];

  return [...standardBrowsers, ...mobileBrowsers, ...brandedBrowsers];
};

// Get reporters configuration
const getReporters = (isCI) => {
  const baseReporters = [['html', { outputFolder: './playwright-report' }]];
  return isCI
    ? [...baseReporters, ['junit', { outputFile: 'test-results/results.xml' }]]
    : baseReporters;
};

// Main config export
export default defineConfig(() => {
  const config = getEnvConfig();

  console.log(`Playwright Mode: ${config.mode}, Base URL: ${config.baseURL}`);

  return {
    testDir: './src/shared/testing/e2e',
    fullyParallel: true,
    forbidOnly: config.isCI,
    retries: config.isCI
      ? 2
      : config.env.VITE_TEST_RETRIES
        ? parseInt(config.env.VITE_TEST_RETRIES)
        : 0,
    workers: config.isCI
      ? 1
      : config.env.VITE_TEST_WORKERS
        ? parseInt(config.env.VITE_TEST_WORKERS)
        : undefined,
    reporter: getReporters(config.isCI),

    use: {
      baseURL: config.baseURL,
      trace: config.env.VITE_TRACE_MODE || 'on-first-retry',
      screenshot: 'only-on-failure',
      video: config.isCI ? 'on-first-retry' : 'off',
      viewport: { width: 1280, height: 720 },
      actionTimeout: config.env.VITE_ACTION_TIMEOUT
        ? parseInt(config.env.VITE_ACTION_TIMEOUT)
        : 10000,
    },

    projects: getBrowserProjects(config),

    ...(config.env.VITE_START_DEV_SERVER === 'true'
      ? {
          webServer: {
            command: config.env.VITE_DEV_SERVER_COMMAND || 'pnpm dev',
            url: config.baseURL,
            reuseExistingServer: !config.isCI,
            timeout: config.env.VITE_SERVER_TIMEOUT
              ? parseInt(config.env.VITE_SERVER_TIMEOUT)
              : 60000,
          },
        }
      : {}),

    ...(config.env.VITE_USE_GLOBAL_SETUP === 'true'
      ? {
          globalSetup: resolve(__dirname, './src/shared/testing/global-setup.ts'),
          globalTeardown: resolve(__dirname, './src/shared/testing/global-teardown.ts'),
        }
      : {}),
  };
});
