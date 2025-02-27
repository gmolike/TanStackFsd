# TypeScript FSD App

Ein modernes React-Projekt mit TypeScript, das auf Feature-Sliced Design (FSD) Architektur basiert.

## Technologien

- **TypeScript** - Statische Typisierung
- **React** - UI-Bibliothek
- **TanStack Query** - Serverseitiger Zustandsmanagement
- **TanStack Router** - Routing mit File-Based Routing
- **Vite** - Build Tool
- **ESLint** - Linting mit modernster Flat Config
- **Prettier** - Code-Formatierung
- **pnpm** - Paketmanager

## Architektur

Das Projekt folgt dem Feature-Sliced Design (FSD) Ansatz mit folgenden Schichten:

- **app** - Anwendungsinitialisierung, globale Styles und Provider
- **pages** - Anwendungsseiten und Routing-Definitionen
- **widgets** - Zusammengesetzte Blöcke bestehend aus Entities und Features
- **features** - Prozesse, Aktionen, Geschäftslogik
- **entities** - Geschäftsobjekte
- **shared** - Wiederverwendbare Komponenten, Utils, API-Clients

## File-Based Routing

Das Projekt nutzt TanStack Router mit File-Based Routing:

- `src/pages/__root.route.tsx` - Root-Route und Layout-Definition
- `src/pages/index.route.tsx` - Index-Route (/)
- `src/pages/login.route.tsx` - Login-Route (/login)
- `src/pages/protected.route.tsx` - Geschütztes Layout für authentifizierte Routen
- `src/pages/protected.dashboard.route.tsx` - Dashboard-Route (/protected/dashboard)
- `src/pages/404.route.tsx` - 404-Route für nicht gefundene Seiten

Die Routendateien folgen der TanStack Router-Konvention mit dem Muster `*.route.tsx`.

## Projektstruktur

Die Projektstruktur ist streng nach FSD-Prinzipien organisiert:

```
src/
├── app/               # Anwendungsschicht
├── pages/             # Routing-Komponenten und Routendefinitionen
│   ├── __root.route.tsx
│   ├── index.route.tsx
│   ├── login.route.tsx
│   ├── protected.route.tsx
│   ├── protected.dashboard.route.tsx
│   └── 404.route.tsx
├── widgets/           # Komplexe wiederverwendbare Komponenten
├── features/          # Features der Anwendung
├── entities/          # Geschäftsobjekte
└── shared/            # Gemeinsam genutzte Utilities, UI, API etc.
```

## Konfiguration

Das Projekt enthält ausführliche Konfiguration für:

- **ESLint** - `eslint.config.mjs` mit modernem Flat Config-Format und FSD-spezifischen Regeln
- **TypeScript** - `tsconfig.json`, `tsconfig.node.json`, `tsconfig.paths.json`
- **Vite** - `vite.config.ts` mit TanStack Router-Plugin für File-Based Routing
- **TanStack** - `tanstack.config.ts`

## Funktionalitäten

- Authentifizierung (Login)
- Dashboard mit Header und Sidebar
- Geschützte Routen mit automatischer Umleitung

## Setup

```bash
# Installiere Dependencies
pnpm install

# Starte Entwicklungsserver
pnpm dev

# Baue für Produktion
pnpm build

# Führe Linting aus
pnpm lint

# Führe Formatierung aus
pnpm format
```

## Anmeldung

Für Demo-Zwecke kannst du dich mit jeder gültigen E-Mail-Adresse und einem beliebigen Passwort anmelden.

## Besonderheiten

### ESLint-Konfiguration

Die ESLint-Konfiguration verwendet das moderne `eslint.config.mjs` Flat Config-Format und enthält spezielle Regeln, die die FSD-Architektur durchsetzen:

- Verhindern von zirkulären Abhängigkeiten
- Erzwingen der richtigen Import-Reihenfolge
- Sicherstellen, dass niedrigere Schichten keine höheren Schichten importieren

### TypeScript-Pfad-Aliase

Das Projekt verwendet Pfad-Aliase für einfache Imports:

- `~/app/*`
- `~/pages/*`
- `~/widgets/*`
- `~/features/*`
- `~/entities/*`
- `~/shared/*`