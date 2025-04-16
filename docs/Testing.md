# Testing-Anleitung für FSD-Projekte mit TanStack Query

Diese Anleitung beschreibt die Einrichtung und Implementierung eines umfassenden Test-Setups für Feature-Sliced Design (FSD) Projekte mit TanStack Query v5.

## Inhaltsverzeichnis

- [Testing-Anleitung für FSD-Projekte mit TanStack Query](#testing-anleitung-für-fsd-projekte-mit-tanstack-query)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Einrichtung](#einrichtung)
    - [Abhängigkeiten installieren](#abhängigkeiten-installieren)
    - [Skripte konfigurieren](#skripte-konfigurieren)
    - [Vitest konfigurieren](#vitest-konfigurieren)
    - [Playwright konfigurieren](#playwright-konfigurieren)
  - [Unit- und Komponententests mit Vitest](#unit--und-komponententests-mit-vitest)
    - [API-Hooks testen](#api-hooks-testen)
    - [Komponenten mit API-Hooks testen](#komponenten-mit-api-hooks-testen)
    - [Store/Zustand testen](#storezustand-testen)
  - [E2E-Tests mit Playwright](#e2e-tests-mit-playwright)
    - [Authentifizierungstests](#authentifizierungstests)
    - [Seiten-Navigation testen](#seiten-navigation-testen)
  - [Best Practices](#best-practices)
    - [Mocking-Strategien](#mocking-strategien)
    - [Test-Organisation in FSD](#test-organisation-in-fsd)
    - [CI/CD-Integration](#cicd-integration)
  - [Zusammenfassung](#zusammenfassung)

## Einrichtung

### Abhängigkeiten installieren

Installiere die erforderlichen Abhängigkeiten für dein Testsetup:

```bash
# Vitest und Testing Library
pnpm add -D vitest @vitest/ui @vitest/coverage-istanbul jsdom
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Playwright
pnpm add -D @playwright/test
```

### Skripte konfigurieren

Füge folgende Skripte zu deiner `package.json` hinzu:

```json
{
  "scripts": {
    "_________________ Tests __________________": "",

    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",

    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "test:e2e:codegen": "playwright codegen http://localhost:8090",

    "test:all": "pnpm test && pnpm test:e2e",
    "test:ci": "pnpm test:coverage && pnpm test:e2e"
  }
}
```

### Vitest konfigurieren

Erweitere deine `vite.config.ts` mit der Vitest-Konfiguration:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
// ... andere Importe

export default defineConfig({
  // ... andere Konfigurationen

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/shared/test/setup.ts',
    include: ['./src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', '**/e2e/**'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/vite-env.d.ts',
        '**/*.test.*',
        '**/test-utils/**',
      ],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
```

Erstelle eine Setup-Datei für Vitest:

```typescript
// src/shared/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatische Bereinigung nach jedem Test
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

// Polyfills und globale Mocks hier hinzufügen
```

### Playwright konfigurieren

Erstelle eine `playwright.config.ts` im Projektstamm:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/shared/testing/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: './playwright-report' }],
    ...(process.env.CI ? [['github'], ['junit', { outputFile: 'test-results/junit.xml' }]] : []),
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:8090',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:8090',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
```

## Unit- und Komponententests mit Vitest

### API-Hooks testen

API-Hooks wie `useRemoteQuery` sollten isoliert getestet werden, um ihre Funktionalität zu validieren:

```typescript
// src/shared/api/query/__tests__/use-remote-query.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRemoteQuery } from '../use-remote-query';
import * as apiClient from '../../api-client';
import React from 'react';

// Mock mit korrekter TypeScript-Typisierung
vi.mock('../../api-client', () => ({
  apiGet: vi.fn(),
}));

describe('useRemoteQuery', () => {
  let queryClient: QueryClient;
  const mockedApiGet = apiClient.apiGet as vi.MockedFunction<typeof apiClient.apiGet>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
          staleTime: 0,
        },
      },
    });
    vi.clearAllMocks();
  });

  // QueryClientProvider Wrapper
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch data successfully', async () => {
    // Mock-Daten
    const mockData = { id: '1', name: 'Test' };
    mockedApiGet.mockResolvedValueOnce(mockData);

    // Hook rendern
    const { result } = renderHook(
      () => useRemoteQuery(['test'], '/test'),
      { wrapper }
    );

    // Anfangszustand prüfen
    expect(result.current.isLoading).toBe(true);

    // Auf Abschluss warten
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Ergebnisse prüfen
    expect(result.current.data).toEqual(mockData);
    expect(mockedApiGet).toHaveBeenCalledWith('/test', undefined);
  });
});
```

### Komponenten mit API-Hooks testen

Komponenten, die TanStack Query Hooks verwenden, sollten mit gemockten Hooks getestet werden:

```typescript
// src/features/users/ui/__tests__/users-list.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UsersList } from '../users-list';
import { useRemoteQuery } from '@/shared/api/query';

// Mocks
vi.mock('@/shared/api/query', () => ({
  useRemoteQuery: vi.fn(),
}));

describe('UsersList Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
          staleTime: 0,
        },
      },
    });
    vi.clearAllMocks();
  });

  it('should render users when data is loaded', () => {
    // Mock für useRemoteQuery
    const mockedUseRemoteQuery = useRemoteQuery as vi.MockedFunction<typeof useRemoteQuery>;

    mockedUseRemoteQuery.mockReturnValue({
      data: {
        data: [{ id: '1', name: 'John Doe' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      },
      isLoading: false,
      error: null,
      // Weitere erforderliche Rückgabewerte...
      status: 'success',
      isError: false,
    } as any);

    // Komponente rendern
    render(
      <QueryClientProvider client={queryClient}>
        <UsersList />
      </QueryClientProvider>
    );

    // Prüfen, ob Benutzer angezeigt wird
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Store/Zustand testen

Zustandsmanager sollten isoliert getestet werden:

```typescript
// src/entities/user/model/__tests__/user-store.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserStore, initialState } from '../store';

describe('useUserStore', () => {
  beforeEach(() => {
    act(() => {
      useUserStore.setState(initialState);
    });
  });

  it('should update user when setUser action is called', () => {
    const { result } = renderHook(() => useUserStore());

    const mockUser = { id: '1', name: 'Test User' };

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
  });
});
```

## E2E-Tests mit Playwright

### Authentifizierungstests

```typescript
// src/shared/testing/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow a user to login', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('test123');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByTestId('dashboard')).toBeVisible();
  });
});
```

### Seiten-Navigation testen

```typescript
// src/shared/testing/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    // Zur Homepage navigieren
    await page.goto('/');

    // Auf einen Link klicken
    await page.getByRole('link', { name: 'Users' }).click();

    // Überprüfen, ob wir zur richtigen Seite navigiert sind
    await expect(page).toHaveURL('/users');
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  });
});
```

## Best Practices

### Mocking-Strategien

1. **API-Mocks**:

   - Verwende `vi.mock()` für komplette Module
   - Typisiere Mocks mit `vi.MockedFunction<typeof yourFunction>`
   - Setze Mocks vor jedem Test zurück: `vi.clearAllMocks()`

2. **TanStack Query Mocks**:
   - Mock die Hooks selbst, nicht die Netzwerkanfragen
   - Stelle alle erforderlichen Eigenschaften für TanStack Query v5 bereit
   - Verwende `as any` nur als letzten Ausweg, wenn Typen zu komplex werden

### Test-Organisation in FSD

Folge der FSD-Struktur auch in deinen Tests:

- **Shared Layer Tests**: Teste wiederverwendbare Hooks, Utilities und UI-Komponenten

  - `src/shared/api/query/__tests__/`
  - `src/shared/lib/__tests__/`

- **Entity Layer Tests**: Teste Geschäftsmodelle und API-Integrationen

  - `src/entities/user/model/__tests__/`
  - `src/entities/user/api/__tests__/`

- **Feature Layer Tests**: Teste Geschäftslogik und komplexere Komponenten

  - `src/features/auth/by-credentials/__tests__/`

- **E2E-Tests**: Teste die Anwendung als Ganzes
  - `src/shared/testing/e2e/`

### CI/CD-Integration

Füge deinen Testprozess zur CI-Pipeline hinzu:

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps
      - name: Run unit tests
        run: pnpm test:coverage
      - name: Run E2E tests
        run: pnpm test:e2e
      - name: Upload test reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-reports
          path: |
            coverage/
            playwright-report/
            test-results/
```

## Zusammenfassung

Mit dieser Testanleitung kannst du dein FSD-Projekt mit TanStack Query v5 umfassend testen. Die Kombination aus Unit-Tests mit Vitest und E2E-Tests mit Playwright bietet eine robuste Testabdeckung auf allen Ebenen deiner Anwendung, von den einzelnen API-Hooks bis hin zu End-to-End-Funktionalitäten.

Durch die Einhaltung der FSD-Struktur auch in deinen Tests bleibt die Organisation übersichtlich, und die Integration in CI/CD-Pipelines stellt sicher, dass deine Tests als Teil deines Entwicklungszyklus ausgeführt werden.
