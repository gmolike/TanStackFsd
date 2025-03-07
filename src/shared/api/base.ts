// src/shared/api/simulated-api.ts
import { ENV } from '../config/env';

// Verwende die ENV-Konfiguration statt import.meta direkt
const API_URL = ENV.API_URL;

/**
 * API Fehler Klasse
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Generische Type für erfolgreiche API-Antworten
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
}

/**
 * Simulierter API-Client für Entwicklungszwecke
 */
export const baseApi = {
  /**
   * Simulierte GET-Anfrage
   */
  get: async <T>(endpoint: string): Promise<T> => {
    // Simuliere API-Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Demo-Daten für verschiedene Endpunkte
      if (endpoint === '/users/me') {
        // Prüfen, ob der Benutzer im localStorage vorhanden ist
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          return JSON.parse(storedUser) as T;
        }
        throw new ApiError('Nicht authentifiziert', 401);
      }

      console.info(`GET ${API_URL}${endpoint}`);
      throw new ApiError(`Endpunkt nicht implementiert: ${endpoint}`, 404);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`GET Anfrage fehlgeschlagen: ${(error as Error).message}`);
    }
  },

  /**
   * Simulierte POST-Anfrage
   */
  post: async <T>(endpoint: string, data: Record<string, unknown>): Promise<T> => {
    // Simuliere API-Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      console.info(`POST ${API_URL}${endpoint}`, data);

      // Login-Simulation
      if (endpoint === '/login') {
        const { email } = data;

        // Simuliere Fehler bei ungültigen Anmeldedaten
        if (!email || email === '') {
          throw new ApiError('Ungültige Anmeldedaten', 400);
        }

        // Demo-Benutzer zurückgeben
        const user = {
          id: '1',
          name: 'John Doe',
          email,
          role: 'admin',
        };

        // Speichere Benutzer im localStorage für zukünftige GET /users/me Anfragen
        localStorage.setItem('user', JSON.stringify(user));

        return user as unknown as T;
      }

      // Logout-Simulation
      if (endpoint === '/logout') {
        // Entferne Benutzer aus dem localStorage
        localStorage.removeItem('user');
        return {} as T;
      }

      throw new ApiError(`Endpunkt nicht implementiert: ${endpoint}`, 404);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`POST Anfrage fehlgeschlagen: ${(error as Error).message}`);
    }
  },

  /**
   * Simulierte PUT-Anfrage
   */
  put: async <T>(endpoint: string, data: Record<string, unknown>): Promise<T> => {
    // Simuliere API-Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      console.info(`PUT ${API_URL}${endpoint}`, data);

      // Beispiel für einen implementierten PUT-Endpunkt
      if (endpoint.startsWith('/users/') && endpoint.includes('/profile')) {
        const userId = endpoint.split('/')[2];
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
          const user = JSON.parse(storedUser);

          // Aktualisiere nur wenn die ID übereinstimmt
          if (user.id === userId) {
            const updatedUser = {
              ...user,
              ...data,
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser as unknown as T;
          }
        }

        throw new ApiError('Benutzer nicht gefunden', 404);
      }

      throw new ApiError(`Endpunkt nicht implementiert: ${endpoint}`, 404);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`PUT Anfrage fehlgeschlagen: ${(error as Error).message}`);
    }
  },

  /**
   * Simulierte DELETE-Anfrage
   */
  delete: async <T>(endpoint: string): Promise<T> => {
    // Simuliere API-Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 700));

    try {
      console.info(`DELETE ${API_URL}${endpoint}`);

      // Beispiel für einen implementierten DELETE-Endpunkt
      if (endpoint === '/users/me') {
        localStorage.removeItem('user');
        return {} as T;
      }

      throw new ApiError(`Endpunkt nicht implementiert: ${endpoint}`, 404);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`DELETE Anfrage fehlgeschlagen: ${(error as Error).message}`);
    }
  },

  /**
   * Hilfsfunktion zum Hinzufügen von Beispieldaten
   */
  mockData: {
    /**
     * Demo-Benutzer einrichten
     */
    setupDemoUser: (userData: Record<string, unknown> = {}): void => {
      const defaultUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
      };

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...defaultUser,
          ...userData,
        }),
      );

      console.info('Demo-Benutzer eingerichtet:', {
        ...defaultUser,
        ...userData,
      });
    },

    /**
     * Alle simulierten Daten zurücksetzen
     */
    resetAll: (): void => {
      localStorage.removeItem('user');
      console.info('Alle simulierten Daten zurückgesetzt');
    },
  },
};
