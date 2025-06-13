// src/entities/article/index.ts
export type { Article, CreateArticle, Dimensions, Supplier, UpdateArticle } from './model/schema';
export {
  articleSchema,
  createArticleSchema,
  dimensionsSchema,
  supplierSchema,
  updateArticleSchema,
} from './model/schema';

// src/entities/article/api/index.ts

// Export all API hooks
export * from './api/useApi';

// Export mock data generators for testing
export {
  generateArticle,
  generateArticleMix,
  generateArticles,
  mockArticles,
} from './api/mock-data';

// Table Definition
export { articleColumnSets, articleTableDefinition } from './model/table-definition';

// Labels
export { articleLabels } from './model/labels';

// UI Components
export { ArticleStatusBadge } from './ui/status-badge';
export { ArticleStockIndicator } from './ui/stock-indicator';
