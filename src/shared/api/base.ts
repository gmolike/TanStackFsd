// Basis-API-Konfiguration
const API_URL = 'https://api.example.com';

// Einfacher API-Client für Simulationszwecke
export const baseApi = {
  get: async <T>(endpoint: string): Promise<T> => {
    // Simuliere API-Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Demo-Daten für verschiedene Endpunkte
    if (endpoint === '/users/me') {
      // Prüfen, ob der Benutzer im localStorage vorhanden ist
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser) as T;
      }
      throw new Error('Nicht authentifiziert');
    }

    console.info(`GET ${API_URL}${endpoint}`);
    throw new Error(`Endpunkt nicht implementiert: ${endpoint}`);
  },

  post: async <T>(endpoint: string, data: Record<string, unknown>): Promise<T> => {
    // Simuliere API-Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.info(`POST ${API_URL}${endpoint}`, data);

    // Login-Simulation
    if (endpoint === '/login') {
      const { email } = data;

      // Demo-Benutzer zurückgeben
      return {
        id: '1',
        name: 'John Doe',
        email,
        role: 'admin',
      } as unknown as T;
    }

    // Logout-Simulation
    if (endpoint === '/logout') {
      return {} as T;
    }

    throw new Error(`Endpunkt nicht implementiert: ${endpoint}`);
  },

  put: async <T>(endpoint: string, data: Record<string, unknown>): Promise<T> => {
    // Simuliere API-Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 600));

    console.info(`PUT ${API_URL}${endpoint}`, data);
    throw new Error(`Endpunkt nicht implementiert: ${endpoint}`);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    // Simuliere API-Verzögerung
    await new Promise((resolve) => setTimeout(resolve, 700));

    console.info(`DELETE ${API_URL}${endpoint}`);
    throw new Error(`Endpunkt nicht implementiert: ${endpoint}`);
  },
};
