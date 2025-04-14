# Generische Test-Utilities für TanStack Query

Dieses Dokument beschreibt eine Sammlung von generischen Hilfsfunktionen für das Testen von TanStack Query Hooks in React-Anwendungen. Diese Funktionen vereinfachen das Mocking verschiedener Arten von Query-Hooks erheblich.

## Übersicht

TanStack Query (früher React Query) gibt komplexe Objekte mit vielen Eigenschaften zurück. Das Mocking dieser Hooks in Tests kann sehr umständlich werden, wie hier zu sehen:

```typescript
// Komplexes, schwer zu wartendes Mocking
vi.mocked(useDetail).mockReturnValue({
  data: clientMockDto,
  isLoading: false,
  error: null,
  refetch: vi.fn(),
  isError: false,
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isSuccess: false,
  isPlaceholderData: false,
  status: 'error',
  dataUpdatedAt: 0,
  errorUpdatedAt: 0,
  failureCount: 0,
  failureReason: null,
  errorUpdateCount: 0,
  isFetched: false,
  isFetchedAfterMount: false,
  isFetching: false,
  isInitialLoading: false,
  isPaused: false,
  isRefetching: false,
  isStale: false,
  fetchStatus: 'fetching',
  promise: undefined,
});
```

Mit den hier vorgestellten generischen Hilfsfunktionen wird das Mocking übersichtlicher und typsicherer:

```typescript
// Vereinfachtes, übersichtlicheres Mocking
vi.mocked(useDetail).mockReturnValue(
  createQueryResult<ClientDto>({
    data: clientMockDto,
    status: 'error',
  }),
);
```

## Hilfsfunktionen

Die Utility-Bibliothek besteht aus drei Hauptfunktionen:

1. `createQueryResult` - Für Standard-Query-Hooks (useQuery)
2. `createPaginatedQueryResult` - Für paginierte Query-Hooks
3. `createMutationResult` - Für Mutations-Hooks (useMutation)

## Integration in die Projektstruktur

Empfohlene Platzierung der Hilfsfunktionen in der FSD-Architektur:

```
src/
└── shared/
    └── test/
        ├── setup.ts
        └── query-helpers.ts  // Enthält alle Test-Hilfsfunktionen
```

## Beispielverwendung

### Einfache Queries

```typescript
import { createQueryResult } from '~/shared/test/query-helpers';
import { useUsers } from '../api/users-api';

vi.mock('../api/users-api', () => ({
  useUsers: vi.fn(),
}));

describe('Users Component', () => {
  it('renders users when loaded', () => {
    vi.mocked(useUsers).mockReturnValue(
      createQueryResult<User[]>({
        data: [{ id: '1', name: 'John' }],
        isSuccess: true,
      }),
    );

    // Component test...
  });

  it('shows loading state', () => {
    vi.mocked(useUsers).mockReturnValue(
      createQueryResult<User[]>({
        isLoading: true,
        status: 'loading',
      }),
    );

    // Test loading state...
  });

  it('handles errors', () => {
    vi.mocked(useUsers).mockReturnValue(
      createQueryResult<User[], Error>({
        error: new Error('Failed to load'),
        isError: true,
        status: 'error',
      }),
    );

    // Test error handling...
  });
});
```

### Paginierte Queries

```typescript
import { createPaginatedQueryResult } from '~/shared/test/query-helpers';

vi.mocked(useUsersPaginated).mockReturnValue(
  createPaginatedQueryResult<User[]>({
    data: mockUsers,
    hasNextPage: true,
    hasPreviousPage: false,
  }),
);
```

### Mutations

```typescript
import { createMutationResult } from '~/shared/test/query-helpers';

// Einfacher Ausgangszustand
vi.mocked(useCreateUser).mockReturnValue(createMutationResult<User, CreateUserDto>());

// Erfolgreicher Zustand nach Mutation
vi.mocked(useCreateUser).mockReturnValue({
  ...createMutationResult<User, CreateUserDto>(),
  isSuccess: true,
  data: { id: '3', name: 'New User' },
});
```

## Vorteile

1. **Typsicherheit**: Vollständige TypeScript-Typisierung für alle Query-Ergebnisse
2. **Konsistenz**: Konsistente Standardwerte für alle nicht angegebenen Eigenschaften
3. **Lesbarkeit**: Deutlich kürzerer und besser lesbarer Testcode
4. **Wartbarkeit**: Änderungen an TanStack Query API müssen nur an einer Stelle angepasst werden
5. **Vollständigkeit**: Unterstützung für alle Arten von TanStack Query Hooks (Query, Infinite Query, Mutation)

## Implementierungsdetails

Die Hilfsfunktionen stellen sicher, dass:

- Alle erforderlichen Eigenschaften des Query-Ergebnisses vorhanden sind
- Funktionen wie `refetch` und `mutate` als Vitest-Mocks implementiert sind
- Statuszustände (`isLoading`, `isError`, etc.) korrekt und konsistent sind
- `promise` als tatsächliches Promise-Objekt behandelt wird

## Erweiterung

Bei Bedarf können die Hilfsfunktionen um zusätzliche Features erweitert werden:

- Unterstützung für Infinite Queries
- Simulieren von Netzwerkzuständen und Verzögerungen
- Automatisches Generieren von Testdaten

## Zusammenfassung

Diese Test-Utilities erleichtern das Testen von TanStack Query Hooks erheblich und führen zu saubereren, wartbareren Tests. Sie reduzieren den Boilerplate-Code und verbessern die Typsicherheit, während sie gleichzeitig die Flexibilität bieten, alle Aspekte eines Query-Ergebnisses zu mocken.
