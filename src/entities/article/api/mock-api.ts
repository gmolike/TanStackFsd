// src/entities/article/api/mock-api.ts

import type { FilterParam, PaginatedResult, QueryParams } from '~/shared/mock';
import {
  ApiError,
  createApiResponse,
  createMockStorage,
  delay,
  queryData,
  randomDelay,
} from '~/shared/mock';

import type { Article, CreateArticle, UpdateArticle } from '../model/schema';

import { generateArticle, generateArticleMix } from './mock-data';

/**
 * Mock API Implementation für Articles
 * Simuliert eine echte REST API mit CRUD Operationen
 */

// Storage für Articles
const articleStorage = createMockStorage<Article>('articles');

// Initialisiere mit Mock-Daten wenn leer
articleStorage.initialize(() => generateArticleMix(50));

/**
 * Article Mock API
 */
export const articleMockApi = {
  /**
   * Holt alle Artikel mit optionaler Filterung, Sortierung und Paginierung
   */
  async getArticles(params?: QueryParams): Promise<PaginatedResult<Article>> {
    await randomDelay();

    try {
      const articles = articleStorage.getAll();

      // Erweitere QueryParams mit artikel-spezifischen Suchfeldern
      const searchParams: QueryParams = {
        ...params,
        searchFields: params?.searchFields || ['name', 'articleNumber', 'description', 'category'],
      };

      return queryData(articles, searchParams);
    } catch (error) {
      throw new ApiError(500, 'Fehler beim Abrufen der Artikel', error);
    }
  },

  /**
   * Holt einen einzelnen Artikel nach ID
   */
  async getArticleById(id: string): Promise<Article> {
    await randomDelay();

    const article = articleStorage.getById(id);

    if (!article) {
      throw new ApiError(404, `Artikel mit ID ${id} nicht gefunden`);
    }

    return article;
  },

  /**
   * Holt Artikel nach Kategorie
   */
  async getArticlesByCategory(
    category: string,
    params?: Omit<QueryParams, 'filters'>,
  ): Promise<PaginatedResult<Article>> {
    const filters: Array<FilterParam> = [
      { field: 'category', operator: 'eq', value: category },
      ...(params?.filters || []),
    ];

    return this.getArticles({ ...params, filters });
  },

  /**
   * Holt Artikel nach Status
   */
  async getArticlesByStatus(
    status: string,
    params?: Omit<QueryParams, 'filters'>,
  ): Promise<PaginatedResult<Article>> {
    const filters: Array<FilterParam> = [
      { field: 'status', operator: 'eq', value: status },
      ...(params?.filters || []),
    ];

    return this.getArticles({ ...params, filters });
  },

  /**
   * Holt Artikel mit niedrigem Lagerbestand
   */
  async getLowStockArticles(params?: QueryParams): Promise<PaginatedResult<Article>> {
    await randomDelay();

    try {
      const articles = articleStorage.getAll();
      const lowStockArticles = articles.filter(
        (article) => !article.isDigital && article.stock <= article.minStock,
      );

      return queryData(lowStockArticles, params);
    } catch (error) {
      throw new ApiError(500, 'Fehler beim Abrufen der Artikel mit niedrigem Lagerbestand', error);
    }
  },

  /**
   * Erstellt einen neuen Artikel
   */
  async createArticle(data: CreateArticle): Promise<Article> {
    await delay(800); // Längere Verzögerung für Create

    try {
      // Validiere eindeutige Artikelnummer
      const existingArticles = articleStorage.getAll();
      const duplicateNumber = existingArticles.find(
        (article) => article.articleNumber === data.articleNumber,
      );

      if (duplicateNumber) {
        throw new ApiError(409, `Artikelnummer ${data.articleNumber} existiert bereits`);
      }

      // Generiere neue Artikel mit übergebenen Daten
      const newArticle = generateArticle(data);

      // Speichere und gib zurück
      return articleStorage.add(newArticle);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Erstellen des Artikels', error);
    }
  },

  /**
   * Aktualisiert einen Artikel
   */
  async updateArticle(id: string, data: UpdateArticle): Promise<Article> {
    await delay(600);

    try {
      // Prüfe ob Artikel existiert
      const existingArticle = articleStorage.getById(id);
      if (!existingArticle) {
        throw new ApiError(404, `Artikel mit ID ${id} nicht gefunden`);
      }

      // Validiere eindeutige Artikelnummer wenn geändert
      if (data.articleNumber && data.articleNumber !== existingArticle.articleNumber) {
        const articles = articleStorage.getAll();
        const duplicateNumber = articles.find(
          (article) => article.id !== id && article.articleNumber === data.articleNumber,
        );

        if (duplicateNumber) {
          throw new ApiError(409, `Artikelnummer ${data.articleNumber} existiert bereits`);
        }
      }

      // Aktualisiere mit Timestamp
      const updatedArticle = articleStorage.update(id, {
        ...data,
        updatedAt: new Date(),
      });

      if (!updatedArticle) {
        throw new ApiError(500, 'Fehler beim Aktualisieren des Artikels');
      }

      return updatedArticle;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Aktualisieren des Artikels', error);
    }
  },

  /**
   * Löscht einen Artikel
   */
  async deleteArticle(id: string): Promise<void> {
    await delay(700);

    const success = articleStorage.delete(id);

    if (!success) {
      throw new ApiError(404, `Artikel mit ID ${id} nicht gefunden`);
    }
  },

  /**
   * Aktualisiert den Lagerbestand eines Artikels
   */
  async updateStock(id: string, quantity: number): Promise<Article> {
    await randomDelay(100, 300);

    try {
      const article = articleStorage.getById(id);

      if (!article) {
        throw new ApiError(404, `Artikel mit ID ${id} nicht gefunden`);
      }

      if (article.isDigital) {
        throw new ApiError(400, 'Lagerbestand kann für digitale Artikel nicht geändert werden');
      }

      const newStock = article.stock + quantity;

      if (newStock < 0) {
        throw new ApiError(400, `Nicht genügend Lagerbestand. Verfügbar: ${article.stock}`);
      }

      return this.updateArticle(id, { stock: newStock });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Aktualisieren des Lagerbestands', error);
    }
  },

  /**
   * Batch-Operationen
   */
  async createArticleBatch(articles: Array<CreateArticle>): Promise<Array<Article>> {
    await delay(1000);

    const createdArticles: Array<Article> = [];

    for (const articleData of articles) {
      try {
        const article = await this.createArticle(articleData);
        createdArticles.push(article);
      } catch (error) {
        console.error('Fehler beim Erstellen eines Artikels im Batch:', error);
        // Fortsetzung mit anderen Artikeln
      }
    }

    return createdArticles;
  },

  /**
   * Statistiken
   */
  async getArticleStats(): Promise<{
    totalCount: number;
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
    lowStockCount: number;
    digitalCount: number;
    averagePrice: number;
  }> {
    await randomDelay();

    const articles = articleStorage.getAll();

    const stats = {
      totalCount: articles.length,
      byCategory: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      lowStockCount: 0,
      digitalCount: 0,
      totalPrice: 0,
    };

    articles.forEach((article) => {
      // Nach Kategorie
      stats.byCategory[article.category] = (stats.byCategory[article.category] || 0) + 1;

      // Nach Status
      stats.byStatus[article.status] = (stats.byStatus[article.status] || 0) + 1;

      // Niedriger Lagerbestand
      if (!article.isDigital && article.stock <= article.minStock) {
        stats.lowStockCount++;
      }

      // Digitale Artikel
      if (article.isDigital) {
        stats.digitalCount++;
      }

      // Gesamtpreis für Durchschnitt
      stats.totalPrice += article.price;
    });

    return {
      totalCount: stats.totalCount,
      byCategory: stats.byCategory,
      byStatus: stats.byStatus,
      lowStockCount: stats.lowStockCount,
      digitalCount: stats.digitalCount,
      averagePrice:
        stats.totalCount > 0 ? Math.round((stats.totalPrice / stats.totalCount) * 100) / 100 : 0,
    };
  },

  /**
   * Utility-Funktionen
   */
  async resetData(): Promise<void> {
    articleStorage.reset(() => generateArticleMix(50));
  },

  async clearData(): Promise<void> {
    articleStorage.clear();
  },
};
