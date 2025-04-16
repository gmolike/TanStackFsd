# API Integration in FSD Architecture

Diese README dokumentiert die API-Integrationsschicht für unsere React-Anwendung, die nach den Feature-Sliced Design (FSD) Prinzipien strukturiert ist.

## Inhaltsverzeichnis

- [Übersicht](#übersicht)
- [API-Infrastruktur](#api-infrastruktur)
- [Verwendung](#verwendung)
  - [Queries (GET)](#queries-get)
  - [Mutations (POST, PUT, DELETE)](#mutations-post-put-delete)
- [Typsicherheit](#typsicherheit)
- [Tests und Mocking](#tests-und-mocking)
- [Beispiele](#beispiele)

## Übersicht

Unsere API-Integrationsschicht bietet eine konsistente und typsichere Schnittstelle für alle HTTP-Anfragen, die innerhalb der Anwendung gemacht werden. Sie basiert auf Axios und React Query, mit benutzerdefinierten Hooks, die die Abfrage- und Mutationslogik kapseln.

## API-Infrastruktur

Die Hauptkomponenten unserer API-Infrastruktur sind:

- **API-Client** (`src/shared/api/api-client.ts`): Konfiguriert Axios mit Interceptors für Authentifizierung und Fehlerbehandlung
- **Query Hooks** (`src/shared/api/query/`): Bietet typsichere Hooks für Datenabfrage und -mutation
- **Entity-spezifische APIs**: Implementiert in den jeweiligen Entity-Schichten, verwendet die gemeinsamen Hooks

### Struktur

```
src/
├── shared/
│   ├── api/
│   │   ├── api-client.ts           # Axios-Konfiguration und Utilities
│   │   ├── api-instance.ts         # Alternative Axios-Instanz
│   │   ├── base.ts                 # Basis-API für Entwicklung/Mocking
│   │   ├── query/
│   │   │   ├── use-remote-query.ts # Hook für GET-Anfragen
│   │   │   ├── use-remote-mutation.ts # Hook für POST/PUT/DELETE
│   │   │   └── mutation-result-handler.ts # Typen für Callbacks
│   │   └── openapi/
│   │       └── use-generated-api.ts # Integration mit OpenAPI-generierten Clients
├── entities/
│   ├── entity-name/
│   │   └── api/
│   │       └── entity-api.ts       # Entity-spezifische API-Funktionen
├── features/
│   ├── feature-name/
│   │   └── api/
│   │       └── feature-api.ts      # Feature-spezifische API-Funktionen
```

## Verwendung

### Queries (GET)

Für lesende Operationen verwenden wir den `useRemoteQuery` Hook:

```typescript
import { useRemoteQuery } from '~/shared/api/query';
import type { PersonDto } from 'types/backend';

export const usePersons = () => {
  return useRemoteQuery<PersonDto[]>(['persons'], '/api/persons');
};

// In einer Komponente
const { data, isLoading, error, refetch } = usePersons();
```

Alternativ für nicht-React-Kontexte:

```typescript
import { apiGet } from '~/shared/api/api-client';
import type { PersonDto } from 'types/backend';

export const fetchPersons = async (): Promise<PersonDto[]> => {
  return apiGet<PersonDto[]>('/api/persons');
};
```

### Mutations (POST, PUT, DELETE)

Für schreibende Operationen verwenden wir den `useRemoteMutation` Hook:

```typescript
import { useRemoteMutation } from '~/shared/api/query';
import type { PersonDto, CreatePersonDto } from 'types/backend';

export const useCreatePerson = () => {
  return useRemoteMutation<PersonDto, CreatePersonDto>(
    ['persons', 'create'],
    '/api/persons',
    'POST',
  );
};

// In einer Komponente
const { mutate: createPerson, isLoading, error } = useCreatePerson();

// Verwendung
createPerson({ name: 'Max Mustermann', email: 'max@example.com' });

// Mit Callbacks
createPerson(
  { name: 'Max Mustermann', email: 'max@example.com' },
  {
    onSuccess: (data) => {
      console.log('Person created:', data);
    },
    onError: (error) => {
      console.error('Failed to create person:', error);
    },
  },
);
```

## Typsicherheit

Alle API-Funktionen sind vollständig typisiert, um Typsicherheit während der Entwicklung zu gewährleisten:

```typescript
// Definieren von API-Typen für OpenAPI-generierte Schemas
import type { components } from 'types/backend';

export type PersonDto = components['schemas']['PersonDto'];
export type CreatePersonDto = components['schemas']['CreatePersonDto'];

// Oder explizite Typdefinitionen
export interface PersonDto {
  id: string;
  name: string;
  email: string;
}

export interface CreatePersonDto {
  name: string;
  email: string;
}
```

## Tests und Mocking

### API-Client Mocking

Für Unit-Tests können Sie die API-Client-Funktionen mocken:

```typescript
import * as apiClient from '~/shared/api/api-client';
import { vi } from 'vitest';

const personsMock = createMultipleMocks(mock.dto.person, 30).map(personMapper.toFrontendType);

beforeEach(() => {
  vi.spyOn(apiClient, 'apiGet').mockResolvedValue(personsMock);
});

test('fetches persons successfully', async () => {
  const result = await fetchPersons();
  expect(apiClient.apiGet).toHaveBeenCalledWith('/api/persons');
  expect(result).toEqual(personsMock);
});
```

### Hook Mocking

Für Komponententests sollten Sie die Hooks mocken:

```typescript
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { usePersons } from '~/entities/person/api/person-api';
import { PersonList } from '../ui/person-list';

vi.mock('~/entities/person/api/person-api', () => ({
  usePersons: vi.fn()
}));

describe('PersonList', () => {
  const personsMock = [/* ... */];

  beforeEach(() => {
    vi.mocked(usePersons).mockReturnValue({
      data: personsMock,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    });
  });

  it('renders a list of persons', () => {
    render(<PersonList />);
    personsMock.forEach(person => {
      expect(screen.getByText(person.name)).toBeInTheDocument();
    });
  });
});
```

### Controller Mocking

Wenn Ihre Komponenten Controller verwenden, können Sie diese auch mocken:

```typescript
vi.mock('./api/useController.ts');
vi.mock('../../../widgets/persons/api/useController.ts');

const personsMock = createMultipleMocks(mock.dto.person, 30).map(personMapper.toFrontendType);

beforeEach(() => {
  vi.mocked(useController).mockReturnValue({
    persons: personsMock,
    urlHasPersonId: false,
    isLoading: false,
  });
  vi.mocked(useControllerWidget).mockReturnValue({
    urlHasPersonId: false,
  });
});
```

## Beispiele

### Beispiel 1: Entity-API

```typescript
// src/entities/person/api/person-api.ts
import { apiGet } from '~/shared/api/api-client';
import { useRemoteQuery } from '~/shared/api/query';
import type { components } from 'types/backend';

export type PersonDto = components['schemas']['PersonDto'];

// Für direkte Aufrufe
export const fetchPersons = async (): Promise<PersonDto[]> => {
  return apiGet<PersonDto[]>('/api/persons');
};

// Für React-Komponenten
export const usePersons = () => {
  return useRemoteQuery<PersonDto[]>(['persons'], '/api/persons');
};

export const usePerson = (id: string) => {
  return useRemoteQuery<PersonDto>(['persons', id], `/api/persons/${id}`);
};
```

### Beispiel 2: Feature-API mit Mutation

```typescript
// src/features/create-person/api/create-person-api.ts
import { useRemoteMutation } from '~/shared/api/query';
import type { components } from 'types/backend';

export type PersonDto = components['schemas']['PersonDto'];
export type CreatePersonDto = components['schemas']['CreatePersonDto'];

export const useCreatePerson = () => {
  return useRemoteMutation<PersonDto, CreatePersonDto>(
    ['persons', 'create'],
    '/api/persons',
    'POST',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
```

### Beispiel 3: Verwendung in einer Komponente

```tsx
// src/features/create-person/ui/create-person-form.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCreatePerson, type CreatePersonDto } from '../api/create-person-api';

export const CreatePersonForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreatePersonDto>({
    name: '',
    email: '',
  });

  const { mutate: createPerson, isLoading } = useCreatePerson({
    onSuccess: (data) => {
      toast.success('Person erfolgreich erstellt!');
      navigate(`/persons/${data.id}`);
    },
    onError: (error) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPerson(formData);
  };

  // ... Rest der Komponente
};
```

---

## Migrieren von Fetch zu Axios

Wenn Sie von Fetch zu unserer Axios-basierten API migrieren möchten, verwenden Sie folgende Anleitung:

### Vorher (mit Fetch)

```typescript
import type { components } from 'types/backend.ts';

export const fetchPersons = async () =>
  await fetch('/api/persons').then(
    (r): Promise<Array<components['schemas']['PersonDto']>> => r.json(),
  );
```

### Nachher (mit Axios)

```typescript
import { apiGet } from '~/shared/api/api-client';
import type { components } from 'types/backend.ts';

export type PersonDto = components['schemas']['PersonDto'];

export const fetchPersons = async (): Promise<PersonDto[]> => {
  return apiGet<PersonDto[]>('/api/persons');
};
```

### Oder als React Hook

```typescript
import { useRemoteQuery } from '~/shared/api/query';
import type { components } from 'types/backend.ts';

export type PersonDto = components['schemas']['PersonDto'];

export const usePersons = () => {
  return useRemoteQuery<PersonDto[]>(['persons'], '/api/persons');
};
```
