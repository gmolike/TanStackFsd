# API-Integration mit TanStack Query v5 und OpenAPI

Dieses Dokument bietet eine Anleitung zur korrekten Verwendung der API-Hooks in deinem FSD (Feature-Sliced Design) Projekt.

## 1. Grundlegende API-Client-Konfiguration

Der Basis-API-Client (`api-client.ts`) ist bereits konfiguriert mit:
- Basis-URL aus Umgebungsvariablen
- Auth-Token-Handhabung per Interceptor
- Globale Fehlerbehandlung

```typescript
// Beispiel für den Basis-API-Call
import { apiGet } from '@/shared/api/api-client';

const fetchData = async () => {
  try {
    const data = await apiGet<MyDataType>('/endpoint');
    return data;
  } catch (error) {
    // Fehlerbehandlung
  }
};
```

## 2. TanStack Query v5 Hooks

### Standard Remote Query Hook

Der verbesserte `useRemoteQuery` Hook ist für Standard-API-Calls gedacht:

```typescript
// Beispiel
import { useRemoteQuery } from '@/shared/api/query';

// In einer Komponente
const { data, isLoading, error } = useRemoteQuery<UserType>(
  ['users', userId],
  `/users/${userId}`,
  { params: { includeDetails: true } }
);
```

### Standard Remote Mutation Hook

Der verbesserte `useRemoteMutation` Hook ist für Datenänderungen gedacht:

```typescript
// Beispiel
import { useRemoteMutation } from '@/shared/api/query';

// In einer Komponente
const updateUserMutation = useRemoteMutation<UserType, UpdateUserDto>(
  ['users', userId, 'update'],
  `/users/${userId}`,
  'PUT'
);

// Verwendung
const handleUpdate = async (data: UpdateUserDto) => {
  try {
    const updatedUser = await updateUserMutation.mutateAsync(data);
    // Erfolgsbehandlung
  } catch (error) {
    // Fehlerbehandlung
  }
};
```

## 3. OpenAPI-Integration

### OpenAPI Generator einrichten

Um TypeScript-Clients aus deiner OpenAPI-Spezifikation zu generieren:

1. Füge die OpenAPI Generator CLI zu deinem Projekt hinzu:
```bash
pnpm add -D @openapitools/openapi-generator-cli
```

2. Füge diese Scripts zu deiner package.json hinzu:
```json
"scripts": {
  "openapi:generate": "openapi-generator-cli generate -i http://localhost:3000/api-docs/swagger.json -g typescript-axios -o src/shared/api/generated",
  "openapi:clean": "rimraf src/shared/api/generated",
  "openapi:regenerate": "pnpm openapi:clean && pnpm openapi:generate"
}
```

3. Konfiguriere den Generator mit einer `.openapi-generator-ignore` Datei, um unnötige Dateien auszuschließen

### Verwendung der generierten Clients

Die `useGeneratedQuery` und `useGeneratedMutation` Hooks sind speziell für die Verwendung mit OpenAPI generierten Clients konzipiert:

```typescript
// Beispiel
import { useGeneratedQuery } from '@/shared/api/openapi/use-generated-api';
import { UserApi, Configuration } from '@/shared/api/generated';

const apiConfig = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL,
  accessToken: () => localStorage.getItem('accessToken') || ''
});

const userApi = new UserApi(apiConfig);

// In einer Komponente
const { data, isLoading } = useGeneratedQuery(
  ['users', userId],
  () => userApi.getUserById(userId)
);
```

## 4. Best Practices

1. **Entity-spezifische API-Module**: Erstelle für jede Entity ein eigenes API-Modul in `src/entities/[entity]/api/`

2. **Typsicherheit**: Verwende immer explizite Typen mit den Hooks, um Typsicherheit zu gewährleisten

3. **Abfrage-Invalidierung**: Vergiss nicht, bei Mutationen die relevanten Queries zu invalidieren:

```typescript
// Beispiel
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Nach erfolgreicher Mutation
queryClient.invalidateQueries({ queryKey: ['users'] });
```

4. **Fehlerbehandlung**: Implementiere konsistente Fehlerbehandlung:

```typescript
// Beispiel
const { data, isLoading, error } = useRemoteQuery<UserType>(...);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

5. **Optimistische Updates**: Nutze optimistische Updates für eine bessere UX:

```typescript
const updateUserMutation = useRemoteMutation<UserType, UpdateUserDto>(..., {
  onMutate: async (newData) => {
    // Aktuelle Daten zwischenspeichern
    const previousData = queryClient.getQueryData(['users', userId]);
    
    // Optimistisches Update
    queryClient.setQueryData(['users', userId], (old) => ({
      ...old,
      ...newData
    }));
    
    return { previousData };
  },
  onError: (err, newData, context) => {
    // Bei Fehler zurücksetzen
    queryClient.setQueryData(
      ['users', userId],
      context?.previousData
    );
  }
});
```

6. **Refetch-Strategien**: Konfiguriere die Refetch-Strategien entsprechend deiner Anwendungsfälle:

```typescript
const { data } = useRemoteQuery<UserType>(
  ['users', userId],
  `/users/${userId}`,
  {},
  {
    staleTime: 5 * 60 * 1000, // 5 Minuten
    refetchOnWindowFocus: false,
    refetchOnMount: true
  }
);
```

Mit dieser Anleitung solltest du in der Lage sein, die API-Integration in deinem FSD-Projekt effektiv zu implementieren und zu verwalten.