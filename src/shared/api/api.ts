// src/shared/config/api.ts
// Die API_URL kann aus der Umgebung kommen oder einen Standardwert verwenden
export const API_URL = process.env.API_URL || 'http://localhost:3001';

// Alternative für Browser-Umgebungen, wo process.env möglicherweise nicht verfügbar ist
export const getApiUrl = (): string => {
  // In einer realen Anwendung würdest du diese Werte beim Build injizieren
  // z.B. mit Vite's import.meta.env oder durch direkte Ersetzung
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback-Logik
  const env = import.meta.env?.MODE || 'development';
  switch (env) {
    case 'production':
      return 'https://api.production.com';
    case 'staging':
      return 'https://api.staging.com';
    default:
      return 'http://localhost:3001';
  }
};
