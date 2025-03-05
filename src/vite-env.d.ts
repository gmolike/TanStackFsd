/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_API_URL: string;
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    // Hier weitere benötigte Umgebungsvariablen hinzufügen
    readonly [key: string]: string | boolean | undefined;
  };
}
