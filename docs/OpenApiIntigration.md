# API Integration Guide: Working with Remote Data in FSD Architecture

## Inhaltsverzeichnis

1. [Einführung](#einführung)
2. [API-Struktur](#api-struktur)
3. [Query und Mutation Hooks](#query-und-mutation-hooks)
4. [Schritt-für-Schritt: Erstellung eines API-Hooks](#schritt-für-schritt-erstellung-eines-api-hooks)
5. [Implementierung in Komponenten](#implementierung-in-komponenten)
6. [Fehlerbehandlung und Erfolgsrückmeldungen](#fehlerbehandlung-und-erfolgsrückmeldungen)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Einführung

Dieses Dokument bietet eine umfassende Anleitung für die Integration von API-Aufrufen in einer React-Anwendung, die nach der Feature-Sliced Design (FSD) Architektur strukturiert ist. Die vorgestellten Beispiele und Muster konzentrieren sich auf die Erstellung und Verwaltung von Benutzerbeiträgen (Posts), sind aber auf alle API-Interaktionen anwendbar.

## API-Struktur

Unsere API-Struktur basiert auf den folgenden Hauptkomponenten:

- **`api-client.ts`**: Basiseinrichtung mit Axios, einschließlich Interceptors für Authentifizierung und Fehlerbehandlung
- **`query`-Verzeichnis**: Enthält Hooks für Datenabfrage (Query) und -mutation
  - `use-remote-query.ts`: Für GET-Anfragen
  - `use-remote-mutation.ts`: Für POST, PUT, PATCH und DELETE-Anfragen
  - `mutation-result-handler.ts`: Typen für Erfolgs- und Fehlerbehandlung

Diese Struktur folgt dem FSD-Prinzip, eine klare Trennung der Belange zu gewährleisten und die Wiederverwendbarkeit zu fördern.

## Query und Mutation Hooks

### useRemoteQuery

Verwenden Sie diesen Hook für GET-Anfragen. Er ist ein Wrapper um `useQuery` von React Query.

```typescript
function useRemoteQuery<TData, TError = Error>(
  queryKey: QueryKey,
  url: string,
  config?: AxiosRequestConfig,
  options?: UseRemoteQueryOptions<TData, TError>,
): UseQueryResult<TData, TError>;
```

### useRemoteMutation

Verwenden Sie diesen Hook für POST, PUT, PATCH oder DELETE-Anfragen. Er ist ein Wrapper um `useMutation` von React Query.

```typescript
function useRemoteMutation<TData, TVariables, TError = Error, TContext = unknown>(
  mutationKey: MutationKey,
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  config?: AxiosRequestConfig,
  options?: UseRemoteMutationOptions<TData, TVariables, TError, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext>;
```

## Schritt-für-Schritt: Erstellung eines API-Hooks

Am Beispiel eines Hooks zur Erstellung eines neuen Posts:

### 1. Typen definieren

```typescript
// src/features/post/api/types.ts
export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
}
```

### 2. API-Hook erstellen

```typescript
// src/features/post/api/use-create-post.ts
import { useRemoteMutation } from '~/shared/api/query';
import type { RemoteMutationOptions } from '~/shared/api/query/type';
import type { Post, CreatePostDto } from './types';

/**
 * Hook für die Erstellung eines neuen Posts
 */
export const useCreatePost = (options?: RemoteMutationOptions<Post, CreatePostDto>) => {
  return useRemoteMutation<Post, CreatePostDto>(
    ['posts', 'create'],
    '/posts',
    'POST',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    options,
  );
};
```

### 3. Hook für Datenabruf erstellen (optional)

```typescript
// src/features/post/api/use-posts.ts
import { useRemoteQuery } from '~/shared/api/query';
import type { Post } from './types';

/**
 * Hook zum Abrufen aller Posts
 */
export const usePosts = () => {
  return useRemoteQuery<Post[]>(['posts'], '/posts');
};

/**
 * Hook zum Abrufen eines spezifischen Posts
 */
export const usePost = (id: string) => {
  return useRemoteQuery<Post>(['posts', id], `/posts/${id}`);
};
```

## Implementierung in Komponenten

### Formular für die Erstellung eines Posts

```tsx
// src/features/post/ui/create-post-form.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useCreatePost } from '../api/use-create-post';
import type { CreatePostDto } from '../api/types';

export const CreatePostForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreatePostDto>({
    title: '',
    content: '',
  });

  // Create post mutation with success and error handling
  const {
    mutate: createPost,
    isLoading,
    error,
  } = useCreatePost({
    onSuccess: (data) => {
      toast.success('Beitrag erfolgreich erstellt!');
      navigate(`/posts/${data.id}`);
    },
    onError: (error) => {
      toast.error(`Fehler beim Erstellen des Beitrags: ${error.message}`);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validierung
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Titel und Inhalt sind erforderlich');
      return;
    }

    // Daten absenden
    createPost(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields omitted for brevity */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Wird erstellt...' : 'Beitrag erstellen'}
      </button>
    </form>
  );
};
```

### Anzeigen von Posts

```tsx
// src/features/post/ui/post-list.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import { usePosts } from '../api/use-posts';
import type { Post } from '../api/types';

export const PostList: React.FC = () => {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <div>Beiträge werden geladen...</div>;
  if (error) return <div>Fehler beim Laden der Beiträge: {error.message}</div>;
  if (!posts || posts.length === 0) return <div>Keine Beiträge gefunden</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="rounded-lg border p-4">
          <h2>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};
```

## Fehlerbehandlung und Erfolgsrückmeldungen

Die Fehlerbehandlung und Erfolgsrückmeldungen sind entscheidend für eine gute Benutzererfahrung. Unsere Hooks bieten die folgenden Callback-Optionen:

### onSuccess

Wird aufgerufen, wenn die Anfrage erfolgreich abgeschlossen wurde. Hier können Sie:

- Benachrichtigungen anzeigen (z.B. mit toast)
- Zu einer anderen Seite navigieren
- Den Cache aktualisieren
- Formulardaten zurücksetzen

```typescript
onSuccess: (data) => {
  toast.success('Aktion erfolgreich abgeschlossen!');
  navigate('/success-page');
};
```

### onError

Wird aufgerufen, wenn bei der Anfrage ein Fehler auftritt. Hier können Sie:

- Fehlermeldungen anzeigen
- Fehler loggen
- Wiederholungslogik implementieren

```typescript
onError: (error) => {
  toast.error(`Es ist ein Fehler aufgetreten: ${error.message}`);
  console.error('API Error:', error);
};
```

### onSettled

Wird aufgerufen, nachdem die Anfrage abgeschlossen wurde, unabhängig davon, ob sie erfolgreich war oder nicht. Nützlich für Aufgaben wie:

- Ladezustände zurücksetzen
- Aufräumaktionen durchführen

```typescript
onSettled: (data, error) => {
  setIsSubmitting(false);
};
```

## Best Practices

### 1. Typisierung

Verwenden Sie immer korrekte TypeScript-Typen für Ihre API-Hooks:

```typescript
// Beispiel für gute Typisierung
useRemoteMutation<Post, CreatePostDto>(...)
```

### 2. Query-Keys

Wählen Sie aussagekräftige Query-Keys, die die Hierarchie der Daten widerspiegeln:

```typescript
// Gut
['posts'][('posts', postId)][('posts', 'create')][ // Für alle Posts // Für einen einzelnen Post // Für Post-Erstellung
  // Vermeiden
  'postsList'
][('getPost', postId)];
```

### 3. Wiederverwendbarkeit

Erstellen Sie wiederverwendbare Hooks in der richtigen FSD-Schicht:

- Generische API-Hooks in `shared/api`
- Entitätsspezifische Hooks in `entities/{entity}/api`
- Feature-spezifische Hooks in `features/{feature}/api`

### 4. Fehlerbehandlung

Implementieren Sie eine konsistente Fehlerbehandlung:

```typescript
// Globale Fehlerbehandlung in Ihrem API-Client
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Authentifizierungsfehler behandeln
    }
    return Promise.reject(error);
  },
);

// Spezifische Fehlerbehandlung in Komponenten
const { error } = usePost(postId);
if (error) {
  // Fehler in der UI anzeigen
}
```

## Troubleshooting

### Problem: Abfragen werden nicht aktualisiert

**Lösung:**

- Überprüfen Sie die Query-Keys auf Konsistenz
- Verwenden Sie die `invalidateQueries`-Methode nach Mutationen

```typescript
const queryClient = useQueryClient();

// Nach einer Mutation
onSuccess: () => {
  queryClient.invalidateQueries(['posts']);
};
```

### Problem: Infinite Loading

**Lösung:**

- Stellen Sie sicher, dass Fehler korrekt behandelt werden
- Überprüfen Sie Ihre Bedingungs-Rendering-Logik

```tsx
// Korrektes Bedingungs-Rendering
if (isLoading) return <Loader />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

// Komponente rendern
return <YourComponent data={data} />;
```

### Problem: Veraltete Daten im Cache

**Lösung:**

- Passen Sie `staleTime` und `cacheTime` an
- Verwenden Sie `refetchOnWindowFocus` oder `refetchOnMount`

```typescript
useRemoteQuery(['posts'], '/posts', undefined, {
  staleTime: 60000, // 1 Minute
  refetchOnWindowFocus: true,
});
```

---

## Zusammenfassung

Die korrekte Implementierung von API-Integrationen in einer FSD-Architektur erfordert eine klare Struktur und gute Typisierung. Durch die Verwendung der `useRemoteQuery` und `useRemoteMutation` Hooks können Sie:

1. Remote-Daten sicher und typsicher abrufen und bearbeiten
2. Lade-, Erfolgs- und Fehlerzustände effizient verwalten
3. Eine konsistente Benutzererfahrung über die gesamte Anwendung hinweg bieten

Folgen Sie diesen Richtlinien, um eine robuste und wartbare API-Integration zu gewährleisten.
