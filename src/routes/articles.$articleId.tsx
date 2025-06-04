import { createFileRoute } from '@tanstack/react-router';

import { ArticlesDetailPage } from '~/pages/articles';

export const Route = createFileRoute('/articles/$articleId')({
  component: ArticlesDetailPage,
});
