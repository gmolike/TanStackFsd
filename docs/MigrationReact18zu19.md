# React 19 Migration Guide für FSD Architektur

## 1. Hauptveränderungen in React 19

Die wichtigsten Änderungen in React 19, die ein Refactoring erfordern:

- Entfernung der Legacy APIs und Lifecycle-Methoden
- React.FC veraltet und sollte nicht mehr verwendet werden
- Neue Hooks API ersetzt bestehende Hooks
- React Server Components (Optional)
- Automatische Batching für alle Updates
- Verbesserte Suspense & Transitions

## 2. Deprecation & Refactoring Checkliste

### React.FC und Component-Typisierung

**Veraltet:**

```tsx
const MyComponent: React.FC<Props> = (props) => { ... }
```

**Neue Methode:**

```tsx
// Einfache Funktionskomponente mit expliziter Typisierung der Props
function MyComponent(props: Props) { ... }

// Oder mit destructuring
function MyComponent({ title, user }: Props) { ... }
```

### Lifecycle-Methoden in Klassenkomponenten

Konvertieren Sie alle verbleibenden Klassenkomponenten zu Funktionskomponenten:

**Veraltet:**

```tsx
class UserProfile extends React.Component<Props, State> {
  componentDidMount() { ... }
  componentDidUpdate() { ... }
  componentWillUnmount() { ... }
}
```

**Neue Methode:**

```tsx
function UserProfile(props: Props) {
  const [state, setState] = useState<State>({ ... });

  useEffect(() => {
    // componentDidMount & componentDidUpdate Logik
    return () => {
      // componentWillUnmount Logik
    };
  }, [relevantDependencies]);
}
```

### React.createRef

**Veraltet:**

```tsx
class MyForm extends React.Component {
  inputRef = React.createRef<HTMLInputElement>();
}
```

**Neue Methode:**

```tsx
function MyForm() {
  const inputRef = useRef<HTMLInputElement>(null);
}
```

### Context API (alte Version)

**Veraltet:**

```tsx
const MyContext = React.createContext();

<MyContext.Provider value={value}>
  <MyContext.Consumer>{(value) => <div>{value}</div>}</MyContext.Consumer>
</MyContext.Provider>;
```

**Neue Methode:**

```tsx
const MyContext = createContext<MyContextType | undefined>(undefined);

function useMyContext() {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
}

function MyContextProvider({ children }: { children: React.ReactNode }) {
  // state und Provider-Logik
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
```

### TanStack Router Anpassungen

TanStack Router sollte mit React 19 kompatibel sein, aber überprüfen Sie:

1. Aktualisieren Sie alle Route-Definitionen gemäß neuer TanStack Router API
2. Ersetzen Sie useParams, useLocation etc. durch die TanStack Router Äquivalente
3. Entfernen Sie alle Verweise auf react-router-dom wenn möglich

### React Query Anpassungen

1. Verwenden Sie die neuesten TanStack Query v5 Patterns
2. Aktualisieren Sie alle Query-Hooks auf die neueste Syntax

**Veraltet:**

```tsx
const { data, isLoading, error } = useQuery('users', fetchUsers);
```

**Neue Methode:**

```tsx
const { data, isPending, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

## 3. Shared Layer Optimierungen

### API Client-Anpassungen

1. Überprüfen Sie Ihre API-Client Implementierung auf veraltete Patterns
2. Updaten Sie die Hook-APIs für React 19:

```tsx
// In ~/shared/api/query/use-remote-query.ts
export function useRemoteQuery<TData, TError = Error>(
  queryKey: QueryKey,
  url: string,
  config?: AxiosRequestConfig,
  options?: UseQueryOptions<TData, TError>,
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const response = await apiGet<TData>(url, config);
      return response;
    },
    ...options,
  });
}
```

### UI-Komponenten

1. Aktualisieren Sie alle shadcn/ui Komponenten auf die neueste Version
2. Entfernen Sie React.FC in allen UI-Komponenten:

```tsx
// Veraltet
export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {...}

// Neu
export function Button({ children, ...props }: ButtonProps) {...}
```

## 4. Neue Features nutzen

### Automatisches Batching

React 19 führt automatisches Batching für alle Updates ein:

```tsx
// Vor React 19 würden diese separaten Renderings verursachen
// außerhalb von React-Events oder React-Batching-Funktionen
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
}, 0);

// In React 19 werden diese automatisch gebatched
```

### Transitions für verzögerte UI-Updates

```tsx
import { useTransition } from 'react';

function SearchComponent() {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');

  function handleChange(e) {
    const value = e.target.value;
    setSearchQuery(value);

    startTransition(() => {
      // Teure Update-Operationen
      performSearch(value);
    });
  }

  return (
    <>
      <input onChange={handleChange} value={searchQuery} />
      {isPending && <Spinner />}
      <SearchResults />
    </>
  );
}
```

## 5. FSD-spezifische Anpassungen

### Layer-bezogene Anpassungen

1. **Shared Layer**:

   - UI-Komponenten: Entfernen Sie React.FC
   - Lib-Funktionen: Optimieren Sie für React 19
   - API-Client: Aktualisieren Sie für neueste TanStack Query Version

2. **Entities Layer**:

   - Model: Aktualisieren Sie Store-Implementierungen
   - UI: Konvertieren Sie alle Komponenten zu Funktionen

3. **Features Layer**:

   - Controller-Hooks: Aktualisieren Sie für React 19
   - Form-Handling: Überprüfen Sie auf Kompatibilität mit react-hook-form
   - API-Integration: Verwenden Sie die neueste useRemoteMutation Syntax

4. **Widgets Layer**:

   - Kombinieren Sie Features und Entities mit neuen React 19 Patterns
   - Stellen Sie sicher, dass alle Klassenkomponenten konvertiert wurden

5. **Pages Layer**:
   - Aktualisieren Sie alle Route-Definitionen entsprechend TanStack Router
   - Konvertieren Sie Layouts zu React 19 Funktionskomponenten

## 6. Testing-Anpassungen

Da Sie bereits Vitest verwenden, aktualisieren Sie:

1. Testing-Library-Aufrufe für React 19
2. Mocking-Strategien für Hooks
3. API-Testing mit modernsten Patterns

## 7. Typische Probleme und Lösungen

### Problem 1: useEffect-Abhängigkeiten

```tsx
// Problematisch
useEffect(() => {
  // Logik die von props.id abhängt
}, []); // Fehlende Abhängigkeit

// Lösung
useEffect(() => {
  // Logik die von props.id abhängt
}, [props.id]);
```

### Problem 2: Event Handler in Render

```tsx
// Problematisch (neue Funktion bei jedem Render)
return <button onClick={() => handleClick(id)}>Click</button>;

// Lösung mit useCallback
const memoizedHandler = useCallback(() => {
  handleClick(id);
}, [id, handleClick]);

return <button onClick={memoizedHandler}>Click</button>;
```

## 8. Schrittweise Vorgehensweise

1. Aktualisieren Sie alle Pakete und Dependencies
2. Ändern Sie die TypeScript-Definitionen und Komponenten-Signaturen (entfernen Sie React.FC)
3. Konvertieren Sie alle verbliebenen Klassenkomponenten zu Funktionskomponenten
4. Aktualisieren Sie TanStack Query und Router auf die neuesten Patterns
5. Aktualisieren Sie alle Context-APIs auf das neueste Muster
6. Überprüfen und korrigieren Sie alle useEffect-Abhängigkeiten
7. Führen Sie Tests auf jeder Ebene durch
8. Optimieren Sie Performance mit neuen React 19 Features

## 9. Beispiel für die Migration eines API-Hooks

### Alte Implementation:

```tsx
// ~/shared/api/query/use-remote-query.ts
export function useRemoteQuery<TData, TError = Error>(
  queryKey: QueryKey,
  url: string,
  config?: AxiosRequestConfig,
  options?: UseQueryOptions<TData, TError>,
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError>(
    queryKey,
    async () => {
      const response = await apiGet<TData>(url, config);
      return response;
    },
    options,
  );
}
```

### Neue Implementation:

```tsx
// ~/shared/api/query/use-remote-query.ts
export function useRemoteQuery<TData, TError = Error>(
  queryKey: QueryKey,
  url: string,
  config?: AxiosRequestConfig,
  options?: UseQueryOptions<TData, TError>,
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const response = await apiGet<TData>(url, config);
      return response;
    },
    ...options,
  });
}
```

## 10. Beispiel für die Migration eines Mutation-Hooks

### Alte Implementation:

```tsx
// ~/shared/api/query/use-remote-mutation.ts
export function useRemoteMutation<TData, TVariables, TError = Error>(
  mutationKey: MutationKey,
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<TData, TError, TVariables>,
): UseMutationResult<TData, TError, TVariables> {
  return useMutation<TData, TError, TVariables>(
    mutationKey,
    async (variables) => {
      const response = await apiRequest<TData, TVariables>(url, method, variables, config);
      return response;
    },
    options,
  );
}
```

### Neue Implementation:

```tsx
// ~/shared/api/query/use-remote-mutation.ts
export function useRemoteMutation<TData, TVariables, TError = Error>(
  mutationKey: MutationKey,
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<TData, TError, TVariables>,
): UseMutationResult<TData, TError, TVariables> {
  return useMutation<TData, TError, TVariables>({
    mutationKey,
    mutationFn: async (variables) => {
      const response = await apiRequest<TData, TVariables>(url, method, variables, config);
      return response;
    },
    ...options,
  });
}
```

## 11. Verbesserung der API-Integration mit React 19

Mit React 19 können Sie folgende Verbesserungen vornehmen:

1. Nutzen Sie die verbesserte Suspense-Unterstützung für Datenladezustände
2. Implementieren Sie Error Boundaries für API-Fehlerbehandlung
3. Verwenden Sie Transitions für teure Datenabrufe
4. Nutzen Sie Automatic Batching für mehrere State-Updates

### Beispiel für Suspense mit TanStack Query:

```tsx
// In einer Page-Komponente
export default function UsersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UsersList />
    </Suspense>
  );
}

// In der Komponente, die Daten abruft
function UsersList() {
  const { data } = useRemoteQuery<User[]>(['users'], '/api/users', {}, { suspense: true });

  return <ul>{data?.map((user) => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

## 12. Checkliste für die Migration

Verwenden Sie die folgende Checkliste, um sicherzustellen, dass Sie alle wichtigen Aspekte der Migration behandelt haben:

- [ ] Alle Packages und Dependencies aktualisiert
- [ ] React.FC aus allen Komponenten entfernt
- [ ] Klassenkomponenten zu Funktionskomponenten konvertiert
- [ ] useEffect-Abhängigkeiten überprüft und korrigiert
- [ ] Event Handler mit useCallback optimiert
- [ ] TanStack Query auf v5 Syntax aktualisiert
- [ ] TanStack Router auf neueste Version aktualisiert
- [ ] Context-APIs modernisiert
- [ ] Tests für React 19 angepasst
- [ ] Neue React 19 Features wie Transitions und Automatic Batching implementiert
- [ ] Performance-Optimierungen überprüft
