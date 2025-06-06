// src/shared/mock/mock-storage.ts

/**
 * Mock Storage für persistente Mock-Daten
 * Nutzt localStorage für Persistenz zwischen Seitenladungen
 */

export class MockStorage<T extends { id: string }> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = `mock_${storageKey}`;
  }

  /**
   * Lädt alle Elemente aus dem Storage
   */
  getAll(): Array<T> {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error loading mock data for ${this.storageKey}:`, error);
      return [];
    }
  }

  /**
   * Lädt ein einzelnes Element nach ID
   */
  getById(id: string): T | undefined {
    const items = this.getAll();
    return items.find((item) => item.id === id);
  }

  /**
   * Speichert alle Elemente
   */
  setAll(items: Array<T>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error(`Error saving mock data for ${this.storageKey}:`, error);
    }
  }

  /**
   * Fügt ein neues Element hinzu
   */
  add(item: T): T {
    const items = this.getAll();
    items.push(item);
    this.setAll(items);
    return item;
  }

  /**
   * Aktualisiert ein Element
   */
  update(id: string, updates: Partial<T>): T | undefined {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return undefined;
    }

    items[index] = { ...items[index], ...updates };
    this.setAll(items);
    return items[index];
  }

  /**
   * Löscht ein Element
   */
  delete(id: string): boolean {
    const items = this.getAll();
    const filteredItems = items.filter((item) => item.id !== id);

    if (filteredItems.length === items.length) {
      return false;
    }

    this.setAll(filteredItems);
    return true;
  }

  /**
   * Löscht alle Elemente
   */
  clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Prüft, ob Daten vorhanden sind
   */
  isEmpty(): boolean {
    return this.getAll().length === 0;
  }

  /**
   * Initialisiert Storage mit Daten, wenn leer
   */
  initialize(generator: () => Array<T>): void {
    if (this.isEmpty()) {
      const items = generator();
      this.setAll(items);
    }
  }

  /**
   * Setzt Storage zurück und initialisiert neu
   */
  reset(generator: () => Array<T>): void {
    this.clear();
    this.initialize(generator);
  }
}

/**
 * Factory für Mock Storage Instanzen
 */
export const createMockStorage = <T extends { id: string }>(key: string): MockStorage<T> =>
  new MockStorage<T>(key);

/**
 * Globales Storage Management
 */
export const mockStorageManager = {
  /**
   * Löscht alle Mock-Daten
   */
  clearAll(): void {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith('mock_'));
    keys.forEach((key) => localStorage.removeItem(key));
    console.info('All mock data cleared');
  },

  /**
   * Listet alle Mock Storage Keys
   */
  listStorageKeys(): Array<string> {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith('mock_'))
      .map((key) => key.replace('mock_', ''));
  },

  /**
   * Exportiert alle Mock-Daten
   */
  exportAll(): Record<string, any> {
    const data: Record<string, any> = {};
    const keys = Object.keys(localStorage).filter((key) => key.startsWith('mock_'));

    keys.forEach((key) => {
      try {
        const storageData = localStorage.getItem(key);
        if (storageData) {
          data[key.replace('mock_', '')] = JSON.parse(storageData);
        }
      } catch (error) {
        console.error(`Error exporting ${key}:`, error);
      }
    });

    return data;
  },

  /**
   * Importiert Mock-Daten
   */
  importAll(data: Record<string, any>): void {
    Object.entries(data).forEach(([key, value]) => {
      try {
        localStorage.setItem(`mock_${key}`, JSON.stringify(value));
      } catch (error) {
        console.error(`Error importing ${key}:`, error);
      }
    });
    console.info('Mock data imported successfully');
  },
};
