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
