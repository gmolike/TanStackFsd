import { Link } from '@tanstack/react-router';
import { ChevronRight, Package, Tag } from 'lucide-react';

import type { Article } from '~/entities/article';

import { Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';

interface ArticleListProps {
  articles: Array<Article>;
}

/**
 * ArticleList Widget
 * Zeigt eine Liste von Artikeln in Karten-Format an
 */
export function ArticleList({ articles }: ArticleListProps) {
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    unavailable: 'bg-red-100 text-red-800',
    discontinued: 'bg-gray-100 text-gray-800',
    coming_soon: 'bg-blue-100 text-blue-800',
  };

  const statusLabels = {
    available: 'Verfügbar',
    unavailable: 'Nicht verfügbar',
    discontinued: 'Eingestellt',
    coming_soon: 'Demnächst',
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {articles.map((article) => (
        <Link
          key={article.id}
          to="/articles/$articleId"
          params={{ articleId: article.id }}
          className="group"
        >
          <Card className="h-full transition-all hover:border-primary/20 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="line-clamp-2 text-lg transition-colors group-hover:text-primary">
                    {article.name}
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Art.-Nr.: {article.articleNumber}
                  </p>
                </div>
                <ChevronRight className="ml-2 h-5 w-5 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {article.imageUrl && (
                <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={article.imageUrl}
                    alt={article.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{article.price.toFixed(2)} €</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[article.status]}`}
                  >
                    {statusLabels[article.status]}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span>
                      {article.stock} {article.unit || 'Stück'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>{article.category}</span>
                  </div>
                </div>

                {article.stock <= (article.minStock || 0) && (
                  <p className="text-xs font-medium text-orange-600">⚠️ Niedriger Lagerbestand</p>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
