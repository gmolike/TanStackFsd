// src/routes/articles.tsx
import { createFileRoute } from '@tanstack/react-router';

import { ArticlesListPage } from '~/pages/articles';

export const Route = createFileRoute('/articles')({
  component: ArticlesListPage,
});
