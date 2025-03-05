import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Konfiguration für Playwright Tests
 *
 * Diese Konfiguration verwendet den gleichen Ansatz für Umgebungsvariablen wie die Vite-Konfiguration
 * und bietet verschiedene Einstellungen basierend auf der Umgebung (development, staging, production).
 */
// Erzeugen des __dirname Äquivalents für ES Module
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  // Bestimme den aktuellen Modus basierend auf der NODE_ENV oder nutze 'development' als Standard
  const mode = process.env.NODE_ENV || 'development';

  // Lade Umgebungsvariablen aus .env-Dateien basierend auf dem aktuellen Modus
  const env = loadEnv(mode, process.cwd(), '');

  // Bestimme die Basis-URL basierend auf Umgebungsvariablen oder Standardwerten
  const baseURL =
    env.VITE_TEST_BASE_URL ||
    (env.CI_APP_NAME
      ? `http://${env.CI_APP_NAME}:8080`
      : env.VITE_DEV_SERVER_URL || 'http://localhost:8090');

  // eslint-disable-next-line no-undef
  console.log(`Playwright Mode: ${mode}, Base URL: ${baseURL}`);

  return {
    // Testverzeichnis entsprechend der FSD-Struktur - kann angepasst werden
    testDir: './src/shared/testing/e2e',

    // Tests parallel ausführen für bessere Performance
    fullyParallel: true,

    // Build im CI fehlschlagen lassen, wenn test.only im Code verbleibt
    forbidOnly: !!env.CI,

    // Wiederholungsversuche basierend auf Umgebung
    retries: env.CI ? 2 : env.VITE_TEST_RETRIES ? parseInt(env.VITE_TEST_RETRIES) : 0,

    // Anzahl der parallelen Worker
    workers: env.CI ? 1 : env.VITE_TEST_WORKERS ? parseInt(env.VITE_TEST_WORKERS) : undefined,

    // Reporter konfigurieren
    reporter: [
      ['html', { outputFolder: './playwright-report' }],
      // Füge zusätzliche Reporter für CI-Umgebungen hinzu, falls benötigt
      ...(env.CI ? [['junit', { outputFile: 'test-results/results.xml' }]] : []),
    ],

    // Globale Einstellungen für alle Testprojekte
    use: {
      // Basis-URL für Tests
      baseURL,

      // Trace-Erfassung für Fehlerdiagnose
      trace: env.VITE_TRACE_MODE || 'on-first-retry',

      // Screenshots bei Fehlern
      screenshot: 'only-on-failure',

      // Videomitschnitt je nach Umgebung
      video: env.CI ? 'on-first-retry' : 'off',

      // Viewport Standardgröße
      viewport: { width: 1280, height: 720 },

      // Timeout-Einstellungen
      actionTimeout: env.VITE_ACTION_TIMEOUT ? parseInt(env.VITE_ACTION_TIMEOUT) : 10000,
    },

    // Browser-Projekte definieren
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },

      // Mobile Browser-Tests, standardmäßig deaktiviert
      ...(env.VITE_INCLUDE_MOBILE_TESTS === 'true'
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
        : []),

      // Gebrandete Browser-Tests, standardmäßig deaktiviert
      ...(env.VITE_INCLUDE_BRANDED_BROWSERS === 'true'
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
        : []),
    ],

    // Lokalen Entwicklungsserver starten, wenn benötigt
    ...(env.VITE_START_DEV_SERVER === 'true'
      ? {
          webServer: {
            command: env.VITE_DEV_SERVER_COMMAND || 'pnpm dev',
            url: baseURL,
            reuseExistingServer: !env.CI,
            timeout: env.VITE_SERVER_TIMEOUT ? parseInt(env.VITE_SERVER_TIMEOUT) : 60000,
          },
        }
      : {}),

    // Globale Setup und Teardown-Datei, falls benötigt
    ...(env.VITE_USE_GLOBAL_SETUP === 'true'
      ? {
          globalSetup: resolve(__dirname, './src/shared/testing/global-setup.ts'),
          globalTeardown: resolve(__dirname, './src/shared/testing/global-teardown.ts'),
        }
      : {}),
  };
});
