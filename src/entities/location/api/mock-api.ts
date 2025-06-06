// src/entities/location/api/mock-api.ts

import type { Article } from '~/entities/article';
import type { TeamMember } from '~/entities/team';
import { teamMockApi } from '~/entities/team';

import type { FilterParam, PaginatedResult, QueryParams } from '~/shared/mock';
import { ApiError, createMockStorage, delay, queryData, randomDelay } from '~/shared/mock';

import { articleMockApi } from '../../article/api/mock-api';
import type {
  CreateLocation,
  CreateLocationInventory,
  Location,
  LocationInventory,
  UpdateLocation,
  UpdateLocationInventory,
} from '../model/schema';

import { generateLocation, generateLocationInventory, generateLocationMix } from './mock-data';

/**
 * Mock API Implementation für Locations
 * Simuliert eine echte REST API mit CRUD Operationen
 */

// Storage für Locations
const locationStorage = createMockStorage<Location>('locations');
const inventoryStorage = createMockStorage<LocationInventory>('location-inventory');

// Initialisiere mit Mock-Daten wenn leer
locationStorage.initialize(() => generateLocationMix(20));

// Initialisiere Inventar für existierende Standorte
const initializeInventory = () => {
  const locations = locationStorage.getAll();
  const existingInventory = inventoryStorage.getAll();

  // Skip if already initialized
  if (existingInventory.length > 0) return;

  locations.forEach((location) => {
    if (location.type === 'warehouse' || location.type === 'store') {
      // Füge 20-50 zufällige Artikel zum Lager hinzu
      const articleCount = Math.floor(Math.random() * 30) + 20;

      for (let i = 0; i < articleCount; i++) {
        const inventory = generateLocationInventory(
          location.id,
          `article-${Math.floor(Math.random() * 100)}`,
          location.type,
        );
        inventoryStorage.add(inventory);
      }
    }
  });
};

// Initialisiere Inventar beim ersten Import
initializeInventory();

/**
 * Location Mock API
 */
export const locationMockApi = {
  /**
   * Holt alle Standorte mit optionaler Filterung, Sortierung und Paginierung
   */
  async getLocations(params?: QueryParams): Promise<PaginatedResult<Location>> {
    await randomDelay();

    try {
      const locations = locationStorage.getAll();

      // Erweitere QueryParams mit standort-spezifischen Suchfeldern
      const searchParams: QueryParams = {
        ...params,
        searchFields: params?.searchFields || ['name', 'code', 'address.city', 'type'],
      };

      return queryData(locations, searchParams);
    } catch (error) {
      throw new ApiError(500, 'Fehler beim Abrufen der Standorte', error);
    }
  },

  /**
   * Holt einen einzelnen Standort nach ID
   */
  async getLocationById(id: string): Promise<Location> {
    await randomDelay();

    const location = locationStorage.getById(id);

    if (!location) {
      throw new ApiError(404, `Standort mit ID ${id} nicht gefunden`);
    }

    return location;
  },

  /**
   * Holt Standorte nach Typ
   */
  async getLocationsByType(
    type: Location['type'],
    params?: Omit<QueryParams, 'filters'>,
  ): Promise<PaginatedResult<Location>> {
    const filters: Array<FilterParam> = [
      { field: 'type', operator: 'eq', value: type },
      ...(params?.filters || []),
    ];

    return this.getLocations({ ...params, filters });
  },

  /**
   * Holt Standorte nach Status
   */
  async getLocationsByStatus(
    status: Location['status'],
    params?: Omit<QueryParams, 'filters'>,
  ): Promise<PaginatedResult<Location>> {
    const filters: Array<FilterParam> = [
      { field: 'status', operator: 'eq', value: status },
      ...(params?.filters || []),
    ];

    return this.getLocations({ ...params, filters });
  },

  /**
   * Erstellt einen neuen Standort
   */
  async createLocation(data: CreateLocation): Promise<Location> {
    await delay(800);

    try {
      // Validiere eindeutigen Code
      const existingLocations = locationStorage.getAll();
      const duplicateCode = existingLocations.find(
        (location) => location.code.toUpperCase() === data.code.toUpperCase(),
      );

      if (duplicateCode) {
        throw new ApiError(409, `Standort-Code ${data.code} existiert bereits`);
      }

      // Generiere neuen Standort
      const newLocation = generateLocation(data);

      // Speichere und gib zurück
      return locationStorage.add(newLocation);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Erstellen des Standorts', error);
    }
  },

  /**
   * Aktualisiert einen Standort
   */
  async updateLocation(id: string, data: UpdateLocation): Promise<Location> {
    await delay(600);

    try {
      // Prüfe ob Standort existiert
      const existingLocation = locationStorage.getById(id);
      if (!existingLocation) {
        throw new ApiError(404, `Standort mit ID ${id} nicht gefunden`);
      }

      // Validiere eindeutigen Code wenn geändert
      if (data.code && data.code !== existingLocation.code) {
        const locations = locationStorage.getAll();
        const duplicateCode = locations.find(
          (location) =>
            location.id !== id && location.code.toUpperCase() === data.code.toUpperCase(),
        );

        if (duplicateCode) {
          throw new ApiError(409, `Standort-Code ${data.code} existiert bereits`);
        }
      }

      // Aktualisiere mit Timestamp
      const updatedLocation = locationStorage.update(id, {
        ...data,
        updatedAt: new Date(),
      });

      if (!updatedLocation) {
        throw new ApiError(500, 'Fehler beim Aktualisieren des Standorts');
      }

      return updatedLocation;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Aktualisieren des Standorts', error);
    }
  },

  /**
   * Löscht einen Standort
   */
  async deleteLocation(id: string): Promise<void> {
    await delay(700);

    // Prüfe ob Standort Inventar hat
    const inventory = inventoryStorage.getAll().filter((inv) => inv.locationId === id);
    if (inventory.length > 0) {
      throw new ApiError(
        400,
        'Standort kann nicht gelöscht werden, da noch Inventar vorhanden ist',
      );
    }

    const success = locationStorage.delete(id);

    if (!success) {
      throw new ApiError(404, `Standort mit ID ${id} nicht gefunden`);
    }
  },

  // ===== INVENTAR OPERATIONEN =====

  /**
   * Holt das Inventar eines Standorts
   */
  async getLocationInventory(
    locationId: string,
    params?: QueryParams,
  ): Promise<PaginatedResult<LocationInventory & { article?: Article }>> {
    await randomDelay();

    try {
      // Prüfe ob Standort existiert
      const location = locationStorage.getById(locationId);
      if (!location) {
        throw new ApiError(404, `Standort mit ID ${locationId} nicht gefunden`);
      }

      // Hole Inventar für diesen Standort
      const inventory = inventoryStorage.getAll().filter((inv) => inv.locationId === locationId);

      // Erweitere mit Artikel-Daten
      const inventoryWithArticles = await Promise.all(
        inventory.map(async (inv) => {
          try {
            const article = await articleMockApi.getArticleById(inv.articleId);
            return { ...inv, article };
          } catch {
            return { ...inv, article: undefined };
          }
        }),
      );

      return queryData(inventoryWithArticles, params);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Abrufen des Inventars', error);
    }
  },

  /**
   * Fügt einen Artikel zum Standort-Inventar hinzu
   */
  async addArticleToLocation(data: CreateLocationInventory): Promise<LocationInventory> {
    await delay(500);

    try {
      // Validierungen
      const location = locationStorage.getById(data.locationId);
      if (!location) {
        throw new ApiError(404, `Standort mit ID ${data.locationId} nicht gefunden`);
      }

      // Prüfe ob Artikel existiert
      try {
        await articleMockApi.getArticleById(data.articleId);
      } catch {
        throw new ApiError(404, `Artikel mit ID ${data.articleId} nicht gefunden`);
      }

      // Prüfe ob Artikel bereits am Standort
      const existing = inventoryStorage
        .getAll()
        .find((inv) => inv.locationId === data.locationId && inv.articleId === data.articleId);

      if (existing) {
        throw new ApiError(409, 'Artikel ist bereits am Standort vorhanden');
      }

      // Erstelle Inventar-Eintrag
      const inventory = generateLocationInventory(
        data.locationId,
        data.articleId,
        location.type,
        data,
      );

      return inventoryStorage.add(inventory);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Hinzufügen des Artikels', error);
    }
  },

  /**
   * Aktualisiert Inventar-Informationen
   */
  async updateLocationInventory(
    id: string,
    data: UpdateLocationInventory,
  ): Promise<LocationInventory> {
    await delay(400);

    try {
      const existingInventory = inventoryStorage.getById(id);
      if (!existingInventory) {
        throw new ApiError(404, `Inventar-Eintrag mit ID ${id} nicht gefunden`);
      }

      const updatedInventory = inventoryStorage.update(id, {
        ...data,
        updatedAt: new Date(),
      });

      if (!updatedInventory) {
        throw new ApiError(500, 'Fehler beim Aktualisieren des Inventars');
      }

      return updatedInventory;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Aktualisieren des Inventars', error);
    }
  },

  /**
   * Entfernt einen Artikel aus dem Standort-Inventar
   */
  async removeArticleFromLocation(inventoryId: string): Promise<void> {
    await delay(500);

    const success = inventoryStorage.delete(inventoryId);

    if (!success) {
      throw new ApiError(404, `Inventar-Eintrag mit ID ${inventoryId} nicht gefunden`);
    }
  },

  // ===== TEAM OPERATIONEN =====

  /**
   * Holt alle Teammitglieder eines Standorts
   */
  async getLocationTeamMembers(
    locationId: string,
    params?: QueryParams,
  ): Promise<PaginatedResult<TeamMember>> {
    await randomDelay();

    try {
      // Prüfe ob Standort existiert
      const location = locationStorage.getById(locationId);
      if (!location) {
        throw new ApiError(404, `Standort mit ID ${locationId} nicht gefunden`);
      }

      // Hole alle Team-Mitglieder und filtere nach locationId
      const allMembers = await teamMockApi.getTeamMembers();
      const locationMembers = allMembers.data.filter((member) => member.locationId === locationId);

      return queryData(locationMembers, params);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Abrufen der Teammitglieder', error);
    }
  },

  /**
   * Holt den Manager eines Standorts
   */
  async getLocationManager(locationId: string): Promise<TeamMember | null> {
    await randomDelay();

    try {
      const location = locationStorage.getById(locationId);
      if (!location) {
        throw new ApiError(404, `Standort mit ID ${locationId} nicht gefunden`);
      }

      if (!location.managerId) {
        return null;
      }

      return await teamMockApi.getTeamMemberById(location.managerId);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null; // Manager nicht gefunden
      }
      throw new ApiError(500, 'Fehler beim Abrufen des Managers', error);
    }
  },

  // ===== STATISTIKEN =====

  /**
   * Holt Statistiken für einen Standort
   */
  async getLocationStats(locationId: string): Promise<{
    totalArticles: number;
    totalStock: number;
    totalValue: number;
    lowStockCount: number;
    teamMemberCount: number;
    utilizationRate: number;
  }> {
    await randomDelay();

    try {
      const location = locationStorage.getById(locationId);
      if (!location) {
        throw new ApiError(404, `Standort mit ID ${locationId} nicht gefunden`);
      }

      // Inventar-Statistiken
      const inventory = inventoryStorage.getAll().filter((inv) => inv.locationId === locationId);
      const inventoryWithArticles = await Promise.all(
        inventory.map(async (inv) => {
          try {
            const article = await articleMockApi.getArticleById(inv.articleId);
            return { inventory: inv, article };
          } catch {
            return null;
          }
        }),
      );

      const validInventory = inventoryWithArticles.filter(
        (item): item is NonNullable<typeof item> => item !== null,
      );

      const stats = validInventory.reduce(
        (acc, item) => {
          if (!item.article) return acc;

          acc.totalStock += item.inventory.stock;
          acc.totalValue += item.inventory.stock * (item.article.price || 0);
          if (item.inventory.stock <= item.inventory.minStock) {
            acc.lowStockCount++;
          }
          return acc;
        },
        { totalStock: 0, totalValue: 0, lowStockCount: 0 },
      );

      // Team-Statistiken
      const teamMembers = await this.getLocationTeamMembers(locationId);

      // Auslastung (Mock-Berechnung)
      const utilizationRate = location.capacity
        ? Math.min(95, Math.random() * 40 + 50) // 50-90% Auslastung
        : 0;

      return {
        totalArticles: inventory.length,
        totalStock: stats.totalStock,
        totalValue: Math.round(stats.totalValue * 100) / 100,
        lowStockCount: stats.lowStockCount,
        teamMemberCount: teamMembers.total,
        utilizationRate,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Abrufen der Statistiken', error);
    }
  },

  /**
   * Globale Standort-Statistiken
   */
  async getGlobalLocationStats(): Promise<{
    totalCount: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    totalCapacity: number;
    totalTeamMembers: number;
  }> {
    await randomDelay();

    const locations = locationStorage.getAll();

    const stats = {
      totalCount: locations.length,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      totalCapacity: 0,
    };

    locations.forEach((location) => {
      // Nach Typ
      stats.byType[location.type] = (stats.byType[location.type] || 0) + 1;

      // Nach Status
      stats.byStatus[location.status] = (stats.byStatus[location.status] || 0) + 1;

      // Gesamtkapazität
      if (location.capacity) {
        stats.totalCapacity += location.capacity;
      }
    });

    // Gesamtzahl Mitarbeiter über alle Standorte
    const allTeamMembers = await teamMockApi.getTeamMembers();
    const totalTeamMembers = allTeamMembers.data.filter((member) =>
      locations.some((location) => location.id === member.locationId),
    ).length;

    return {
      ...stats,
      totalTeamMembers,
    };
  },

  /**
   * Utility-Funktionen
   */
  async resetData(): Promise<void> {
    locationStorage.reset(() => generateLocationMix(20));
    inventoryStorage.clear();
    initializeInventory();
  },

  async clearData(): Promise<void> {
    locationStorage.clear();
    inventoryStorage.clear();
  },
};
