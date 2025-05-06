# Conditional Rendering in React: Best Practices

## Übersicht

Dieses Dokument vergleicht verschiedene Ansätze für Conditional Rendering in React und gibt Empfehlungen für Best Practices im Kontext einer Feature-Sliced Design (FSD) Architektur mit TanStack, ShadCN und Tailwind.

## Inhaltsverzeichnis

- [Conditional Rendering in React: Best Practices](#conditional-rendering-in-react-best-practices)
  - [Übersicht](#übersicht)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Einführung](#einführung)
  - [Vergleich der Ansätze](#vergleich-der-ansätze)
    - [Schreibweise 1: Inline-Ternäry im JSX](#schreibweise-1-inline-ternäry-im-jsx)
    - [Schreibweise 2: Early Return Pattern](#schreibweise-2-early-return-pattern)
    - [Schreibweise 3: Separate Komponente](#schreibweise-3-separate-komponente)
  - [Bewertung](#bewertung)
  - [Empfehlungen nach Anwendungsfall](#empfehlungen-nach-anwendungsfall)
    - [Verwende Schreibweise 1 (Inline-Ternäry), wenn:](#verwende-schreibweise-1-inline-ternäry-wenn)
    - [Verwende Schreibweise 2 (Early Return), wenn:](#verwende-schreibweise-2-early-return-wenn)
    - [Verwende Schreibweise 3 (Separate Komponente), wenn:](#verwende-schreibweise-3-separate-komponente-wenn)
  - [Beispiel: Implementation in FSD](#beispiel-implementation-in-fsd)
    - [Verwendung in einer Feature-Komponente](#verwendung-in-einer-feature-komponente)
  - [Fazit](#fazit)

## Einführung

Conditional Rendering ist ein grundlegendes Konzept in React. Es ermöglicht das Anzeigen unterschiedlicher UI-Elemente basierend auf bestimmten Bedingungen, wie Ladezuständen, Datenabhängigkeiten oder Benutzerberechtigungen.

Die Wahl der richtigen Methode für Conditional Rendering kann die Lesbarkeit, Wartbarkeit und Wiederverwendbarkeit des Codes erheblich beeinflussen.

## Vergleich der Ansätze

### Schreibweise 1: Inline-Ternäry im JSX

```jsx
return (
  {isLoading || !data ? <Skeleton /> : <Component data={data} />}
)
```

**Vorteile:**

- Kompakt und knapp für einfache Bedingungen
- Alles bleibt in einer Komponente
- Weniger Dateien und Code für simple Fälle

**Nachteile:**

- Wird schnell unübersichtlich bei komplexen Bedingungen
- Verschlechtert die Lesbarkeit bei verschachtelten Bedingungen
- Mischt Rendering-Logik mit JSX
- Schlechte Skalierbarkeit für komplexere Komponenten

### Schreibweise 2: Early Return Pattern

```jsx
if (isLoading || !data) return <Skeleton />;
return <Component data={data} />;
```

**Vorteile:**

- Deutlich bessere Lesbarkeit durch klare Trennung
- Saubere Separierung von Bedingungs- und Haupt-Rendering
- Gut skalierbar für multiple Bedingungen
- Folgt Clean Code Prinzipien

**Nachteile:**

- Logik ist immer noch innerhalb der Hauptkomponente
- Nicht wiederverwendbar über mehrere Komponenten hinweg
- Bei mehreren Komponenten kann es zu Code-Duplikation führen

### Schreibweise 3: Separate Komponente

```jsx
// In einer separaten Datei (z.B. DataTableWithSkeleton.tsx)
const DataTableWithSkeleton = ({ isLoading, data, columns, ...props }) => {
  if (isLoading) {
    return <DataTableSkeleton columnDef={columns} numRows={10} />;
  }

  return <DataTable columns={columns} data={data} {...props} />;
};

// In der nutzenden Komponente
return <DataTableWithSkeleton isLoading={isLoading} data={data} columns={columns} />;
```

**Vorteile:**

- Optimale Trennung der Zuständigkeiten (Separation of Concerns)
- Maximale Wiederverwendbarkeit
- Deutlich verbesserte Wartbarkeit
- Entspricht React-Komponentenphilosophie und FSD-Prinzipien
- Hervorragende Testbarkeit der einzelnen Komponenten
- Verhindert Code-Duplikation im Projekt
- Encapsulates loading state handling

**Nachteile:**

- Erfordert initial mehr Dateien/Struktur
- Kann für sehr einfache Anwendungsfälle überengineert wirken
- Leicht erhöhter initialer Entwicklungsaufwand

## Bewertung

| Kriterium            | Schreibweise 1 | Schreibweise 2 | Schreibweise 3 |
| -------------------- | -------------- | -------------- | -------------- |
| Lesbarkeit           | ⭐             | ⭐⭐⭐         | ⭐⭐⭐⭐       |
| Wartbarkeit          | ⭐             | ⭐⭐⭐         | ⭐⭐⭐⭐⭐     |
| Wiederverwendbarkeit | ⭐             | ⭐⭐           | ⭐⭐⭐⭐⭐     |
| Testbarkeit          | ⭐⭐           | ⭐⭐⭐         | ⭐⭐⭐⭐       |
| Skalierbarkeit       | ⭐             | ⭐⭐⭐         | ⭐⭐⭐⭐⭐     |
| Einfachheit          | ⭐⭐⭐⭐⭐     | ⭐⭐⭐⭐       | ⭐⭐⭐         |
| FSD-Konformität      | ⭐             | ⭐⭐           | ⭐⭐⭐⭐⭐     |

## Empfehlungen nach Anwendungsfall

### Verwende Schreibweise 1 (Inline-Ternäry), wenn:

- Die Bedingung sehr einfach ist (einzelne Variable)
- Beide Zweige sehr einfache Komponenten rendern
- Keine Wiederverwendung nötig ist
- Es sich um ein kleines Proof-of-Concept handelt

### Verwende Schreibweise 2 (Early Return), wenn:

- Mittlere Komplexität vorliegt
- Mehrere Bedingungen nacheinander geprüft werden müssen
- Die Komponente nicht oft wiederverwendet wird
- Die Komponente ohnehin bereits eine spezifische Funktion hat

### Verwende Schreibweise 3 (Separate Komponente), wenn:

- Das loading/error handling an mehreren Stellen benötigt wird
- Die Anwendung nach FSD-Architektur strukturiert ist
- Die Komponente Teil einer größeren Bibliothek sein soll
- Testbarkeit wichtig ist
- Complex UI components like data tables, charts, or forms are involved
- Du mit einem Team arbeitest und Codestandards wichtig sind

## Beispiel: Implementation in FSD

In einer FSD-Architektur würde die Schreibweise 3 wie folgt umgesetzt:

```
src/
└── shared/
    └── ui/
        ├── data-table-with-skeleton/
        │   ├── index.ts                     # Export der Komponente
        │   └── data-table-with-skeleton.tsx # Implementation
        └── shadcn/
            ├── data-table/
            │   └── ...
            └── data-table-skeleton/
                └── ...
```

Datei: `data-table-with-skeleton.tsx`

```tsx
import React from 'react';
import type { JSX } from 'react';

import type { CustomColumnDef } from '~/shared/ui/shadcn';
import { DataTable, DataTableSkeleton } from '~/shared/ui/shadcn';

// Typen für DataTable Props aus ShadCN extrahieren
export type DataTableProps<TData, TValue> = React.ComponentProps<typeof DataTable<TData, TValue>>;

type Props<TData, TValue = unknown> = {
  isLoading: boolean;
  data: Array<TData>;
  columns: Array<CustomColumnDef<TData, TValue>>;
} & Omit<DataTableProps<TData, TValue>, 'data' | 'columns'>;

const DataTableWithSkeleton = <TData, TValue = unknown>({
  isLoading,
  data,
  columns,
  ...props
}: Props<TData, TValue>): JSX.Element => {
  if (isLoading) {
    return <DataTableSkeleton columnDef={columns} numRows={10} />;
  }

  return <DataTable columns={columns} data={data} {...props} />;
};

export default DataTableWithSkeleton;
```

Datei: `index.ts`

```ts
export { default as DataTableWithSkeleton } from './data-table-with-skeleton';
export type { DataTableProps } from './data-table-with-skeleton';
```

### Verwendung in einer Feature-Komponente

```tsx
// src/features/user-management/ui/user-list.tsx
import { useUsers } from '../api/use-users';
import { userColumns } from './user-columns';
import { DataTableWithSkeleton } from '~/shared/ui/data-table-with-skeleton';

export const UserList = () => {
  const { data, isLoading } = useUsers();

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-4 text-2xl font-bold">Benutzerliste</h1>
      <DataTableWithSkeleton
        isLoading={isLoading}
        data={data || []}
        columns={userColumns}
        pagination
      />
    </div>
  );
};
```

## Fazit

Im Kontext einer modernen React-Anwendung mit FSD-Architektur empfehlen wir:

1. **Schreibweise 3 (Separate Komponente)** als Standardansatz für die meisten Anwendungsfälle, da sie optimal mit FSD harmoniert und eine saubere Trennung von Zuständigkeiten fördert.

2. **Schreibweise 2 (Early Return)** als pragmatischen Kompromiss für Komponenten, die nicht unbedingt wiederverwendet werden und wo eine separate Komponente übertrieben wäre.

3. **Schreibweise 1 (Inline-Ternäry)** nur für sehr einfache Fälle, wo sowohl die Bedingung als auch die gerenderten Elemente sehr einfach sind.

Die Wahl des richtigen Ansatzes hängt letztendlich vom spezifischen Anwendungsfall, der Teamgröße, den Projektanforderungen und dem gewünschten Grad an Wiederverwendbarkeit ab. Im Zweifelsfall ist es jedoch meist besser, auf eine sauberere Struktur zu setzen, die langfristig besser skaliert und gewartet werden kann.
